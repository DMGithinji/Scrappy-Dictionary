import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';

import { ITranslationLinkData } from '@ng-scrappy/models';

import { initializeApp, publishToPubsub } from './../../shared/utils';
import { getLanguageWords } from './../../shared/db';
import { ETLData, IScrapeData } from './../../shared/interfaces';

import { getAndSave } from './utils/trl-details-scrapper';
import { scrambleRelatedWords } from './utils/related-words-scrambler.function';
import { verifyPopularWords } from './utils/fix-missing-popular-words.function';

const { db } = initializeApp()

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '4GB',
} as functions.RuntimeOptions;

export const getTranslations = functions
  .runWith(runtimeOpts)
  .pubsub.topic('getTranslations')
  .onPublish(async (message) => {
    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;

    try {
      const data = JSON.parse(messageBody) as ETLData;
      console.log(
        `[getTranslations] :: ${data.trlLinks.length} Links published for extraction`
      );

      /** Approx. number of simultaneous web scraping requests the target site can handle effectively without noticeable slowing down */
      const asyncNo = 5;

      /** Approx. number of ETLs cloud function can handle syncronously without timing out */
      const repeatSync = 10;

      /** Total ETLs handler will perform */
      const etlCount = asyncNo * repeatSync;

      let etlsDone = 0;
      console.log(`[getTranslations] :: ${etlCount} ETL COUNTS`);

      // Only get translation data that can be done withing pubsub's handler time-limit & without DOS attacking server
      const toTrl = data.trlLinks.slice(0, etlCount);
      console.log(`TO TRANSLATE :: ${toTrl.length}`);

      const remainder = data.trlLinks.slice(etlCount);
      console.log(`REMAINDER :: ${remainder.length}`);

      const syncChunks = _.chunk(toTrl, asyncNo) as ITranslationLinkData[][];

      // Do actual scrapping
      for (let i = 0; i < syncChunks.length; i++) {
        const asyncChunks = syncChunks[i];
        await Promise.all(
          asyncChunks.map((trlData) => {
            etlsDone++;
            console.log(`Getting trl no. ${etlsDone}......`);
            return getAndSave(db, trlData);
          })
        );
      }

      if (remainder.length) {
        console.log(
          `[getTranslations] :: Re-Publishing remainind ${remainder.length} links...`
        );
        await publishToPubsub(
          { trlLinks: remainder, scrapeData: data.scrapeData } as ETLData,
          'getTranslations'
        );
        return;
      }

      if (data?.scrapeData?.isInitialScrape) {
        console.log('Setting initial-scrape dictionary info...');
        await handleInitialScrapeEvent(data.scrapeData);
        console.log(
          `Completed initial-scrape of  ${data.scrapeData.languages[0]} 👌😎`
        );
        return;
      }
    } catch (e) {
      `[getTranslations] :: Error occured:- ${e}`;
    }
  });

/**
 * Extra steps executed when a language has completed being scraped for the first time
 * 1. Ensure all popular language words from target site are added (isn't always the case)
 * 2. Scramble associated related words for each translation, how target site organizes popular words is boring
 * 3. Set dictionary meta-data
 */
async function handleInitialScrapeEvent(scrapeData: IScrapeData) {
  const lang = scrapeData.languages[0];
  await verifyPopularWords(lang, db);

  const langTrls = await getLanguageWords(db, lang, 'createdAt', 2000);

  await scrambleRelatedWords(db, langTrls);

  await updateDictionaryData(lang, langTrls.length);
}

async function updateDictionaryData(lang: string, wordCount: number) {
  const collection = db.collection('dictionary');

  const scrapedLang = await collection
    .doc(lang)
    .get()
    .then((snapshot) => snapshot.data());

  scrapedLang.status = 'supported';
  scrapedLang.createdAt = firestore.Timestamp.now();
  scrapedLang.wordCount = wordCount;

  await collection.doc(lang).update(scrapedLang);
}
