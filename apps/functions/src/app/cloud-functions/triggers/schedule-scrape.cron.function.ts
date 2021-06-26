import * as functions from 'firebase-functions';

import { getLanguages } from './../../shared/db';
import { initializeApp, publishToPubsub } from './../../shared/utils';
import { IScrapeData } from '../../shared/interfaces';
import { GET_TRL_LINKS_PUBSUB_TOPIC } from '../scrappers';


const { db } = initializeApp();

/**
 * Cronjob to run every Sunday at 1AM
 *
 * Triggers scraping of newly added tranlsations of supported languages
 * from target site
 */
export const scheduleScrape = functions.pubsub
  .schedule('1 0 * * SUN')
  .timeZone('Africa/Nairobi')
  .onRun(async (context) => {
    console.log('Executing scrapingCron.');
    console.log(`Context :: ${JSON.stringify(context)}`);

    try {
      const languages = await (await getLanguages(db, 'supported')).map(
        (l) => l.language
      );

      const data = { languages, isInitialScrape: false } as IScrapeData;

      console.log(
        `Publishing ${JSON.stringify(languages)} for scheduled scraping`
      );
      await publishToPubsub(data, GET_TRL_LINKS_PUBSUB_TOPIC);
    } catch (err) {
      console.log('[scrapper]:- Error scheduling scrapping', err);
    }
  });
