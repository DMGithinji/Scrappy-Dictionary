import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { IScrapeData } from '../../shared/interfaces';
import { publishToPubsub } from '../../shared/utils';


const LANGUAGE_PATH = 'dictionary/{id}';
const db = admin.firestore();

/**
 * onWrite handler that is fired whenever language is updated
 * 1. Updates a language's 'supported status' based on the no. of votes
 * 2. Triggers initial scraping of language translations if no. of votes reach threshold
 *
 * Once a language is marked 'supported', it will have it's translations updated weekly
 */
export const setToScraping = functions.firestore
  .document(LANGUAGE_PATH)
  .onUpdate(async (change) => {
    const newData = change.after.data() as ILanguage;
    const objectID = change.after.id;

    if (newData.status === LanguageStatus.Unsupported && newData.votes >= 10) {
      newData.status = LanguageStatus.Scrapping;
      await db.collection('dictionary').doc(objectID).update(newData);

      // trigger scraping
      const data = {
        languages: [newData.language],
        isInitialScrape: true,
      } as IScrapeData;

      console.log(
        `Publishing ${JSON.stringify(newData.language)} for initial scraping`
      );
      await publishToPubsub(data, 'dictionaryScrapper');
    }
  });
