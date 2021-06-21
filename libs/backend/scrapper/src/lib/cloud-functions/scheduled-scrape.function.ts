import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getLanguages } from '@ng-scrappy/backend/db';
import { publishToPubsub } from './../utils/pubsub-publisher';
import { ScrapingMetaData } from './scrapper.function';

const db = admin.firestore();

/**
 * Cronjob to run every Sunday at 1AM
 *
 * Triggers scraping of newly added tranlsations of supported languages
 * from target site
 */
export const scrapingCron = functions
  .pubsub.schedule('1 0 * * SUN')
  .timeZone('Africa/Nairobi')
  .onRun(async (context) => {

    console.log('Executing scrapingCron.');
    console.log(`Context :: ${JSON.stringify(context)}`);

    try {
      const languages = await (await getLanguages(db, 'supported')).map(l => l.language);

      const data = { languages, isInitial: false } as ScrapingMetaData;

      console.log( `Publishing ${JSON.stringify(languages)} for scheduled scraping`);
      await publishToPubsub(data, 'dictionaryScrapper');

    }

    catch(err) {
      console.log('[scrapper]:- Error scheduling scrapping', err);
    }

  });
