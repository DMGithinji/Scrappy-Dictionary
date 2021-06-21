import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { ITranslationLinkData } from '@ng-scrappy/models';
import { shouldAdd } from '@ng-scrappy/backend/db';
import { scrapePopularTrlLinks, scrapeTrlLinks } from './../utils/trl-links-scrapper';
import { publishToPubsub } from './../utils/pubsub-publisher';
import { ETLData } from './get-translations-pubsub.function';

export interface ScrapingMetaData {
  languages: string[];
  isInitial: boolean;
};

const config = functions.config().service_account;

admin.initializeApp(config);

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '4GB',
} as functions.RuntimeOptions;


/**
 * 1. Scrapes all the links required for scrapping individial word translation data
 * 2. Fires off pubsub responsible for scraping individual word translation data
 *    for each valid link retrieved
 */
export const dictionaryScrapper = functions
  .runWith(runtimeOpts)
  .pubsub.topic('dictionaryScrapper')
  .onPublish(async (message) => {

    console.log('Executing scrappy.');

    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;

    try {
      const data = JSON.parse(messageBody) as ScrapingMetaData;
      const langs = data.languages

      // Scrape all links to scrape translation data
      const trlLinkData = await scrapeTrlLinks(langs);
      const popLinkData = await scrapePopularTrlLinks(langs);
      const all = _.uniqBy(_.flattenDeep([...trlLinkData, ...popLinkData]), (trlData) => trlData.word);

      // Filter out saved data/blacklisted words
      const filtered: ITranslationLinkData[] = [];

      await Promise.all(
        all.map(async (data) => {
            if (await shouldAdd(db, data)) {
              filtered.push(data);
            }
          })
        );

      console.log(`Filtered out ${all.length - filtered.length} from ${ all.length } trlLinks`);

      if (filtered.length) {
        const etlData = { trlLinks: filtered,
                          // Scrape data important only for initial scraping
                          scrapeData: { language: data.isInitial ? langs[0] : '',
                                        isInitialScrape: data.isInitial }
                        } as ETLData;

        console.log( `Publishing ${etlData.trlLinks.length} to getTranslationsFromLinks`);
        await publishToPubsub(etlData, 'getTranslationsFromLinks');
      }
    }

    catch(err) {
      console.log('[scrapper]:- Error scrapping', err);
    }

  });
