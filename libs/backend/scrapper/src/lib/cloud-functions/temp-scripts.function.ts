import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getLanguageWords, getSupportedLangs, setToAlgolia } from '@ng-scrappy/backend/db';

const db = admin.firestore();

export const tempScript = functions
  .https.onRequest(async (req, res) => {
    try {
      console.log('Executing scrappy.');

      // Step 1. Get all trl links for each language
      const langs = await getSupportedLangs(db);

      await Promise.all(langs.map(async (lang, i) => {
        const langTrls = await getLanguageWords(db, lang.language);
        return setToAlgolia(langTrls)
      }))


      res.send('Completed getting translation data for langs');
    }

    catch(err) {
      console.log('[scrapper]:- Error scrapping', err);
    }

  });
