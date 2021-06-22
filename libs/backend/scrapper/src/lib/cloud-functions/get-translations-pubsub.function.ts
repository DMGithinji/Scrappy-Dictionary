import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
import { ITranslationLinkData } from '@ng-scrappy/models';
import { getAndSave } from './../utils/trl-details-scrapper';
import { publishToPubsub } from '../utils/pubsub-publisher';
import { verifyPopularWords } from '../scripts/fix-missing-popular-words.function';
import { getLanguageWords, scrambleRelatedWords } from '@ng-scrappy/backend/db';

export interface ETLData {
  trlLinks: ITranslationLinkData[];
  scrapeData: IScrapeData;
}

interface IScrapeData {
  language: string;
  isInitialScrape: boolean;
}

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '4GB',
} as functions.RuntimeOptions;

export const getTranslationsFromLinks = functions
  .runWith(runtimeOpts)
  .pubsub.topic('getTranslationsFromLinks')
  .onPublish(async (message) => {
    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;

    try {
      const data = JSON.parse(messageBody) as ETLData;
      console.log(
        `[getTranslationsFromLinks] :: ${data.trlLinks.length} Links published for extraction`
      );

      /** Estimate concurrent extract requests target can handle effectively without noticeable slowing down */
      const asyncNo = 5;
      /** Estimate ETLs handler can handle syncronously without timing out */
      const repeatSync = 10;
      /** Total ETLs handler will perform */
      const etlCount = asyncNo * repeatSync;
      let done = 0;
      console.log(`[getTranslationsFromLinks] :: ${etlCount} ETL COUNTS`);

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
            done++;
            console.log(`Getting trl no. ${done}......`);
            return getAndSave(db, trlData);
          })
        );
      }

      if (remainder.length) {
        console.log(
          `[getTranslationsFromLinks] :: Re-Publishing remainind ${remainder.length} links...`
        );
        await publishToPubsub(
          { trlLinks: remainder, scrapeData: data.scrapeData } as ETLData,
          'getTranslationsFromLinks'
        );
        return;
      }

      if (data?.scrapeData?.isInitialScrape) {
        console.log('Setting initial-scrape dictionary info...');
        await handleInitialScrapeEvent(data.scrapeData);
        console.log(
          `Completed initial-scrape of  ${data.scrapeData.language} 👌😎`
        );
        return;
      }
    } catch (e) {
      `[getTranslationsFromLinks] :: Error occured:- ${e}`;
    }
  });

/**
 * Extra steps executed When a language has completed being scraped for the first time
 * 1. Ensure all popular language words from target site are added (isn't always the case)
 * 2. Scramble associated related words for each translation, how target site organizes popular words is boring
 * 3. Set dictionary meta-data
 */
async function handleInitialScrapeEvent(scrapeData: IScrapeData) {
  const lang = scrapeData.language;
  await verifyPopularWords(scrapeData.language, db);

  const langTrls = await getLanguageWords(db, lang, 'createdAt', 2000);

  await scrambleRelatedWords(db, langTrls);

  await updateDictionaryData(scrapeData.language, langTrls.length);
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
