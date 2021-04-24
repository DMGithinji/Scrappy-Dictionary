import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { getLanguageWords, getSupportedLangs, setSuggestions, setToAlgolia } from '@ng-scrappy/backend/db';
import { verifyPopularWords } from '../scripts/fix-missing-popular-words.function';

const db = admin.firestore();

export const tempScript = functions
  .https.onRequest(async (req, res) => {
    try {
      console.log('Executing scrappy.');

      // Step 1. Get all trl links for each language
      const langs = await getSupportedLangs(db);

      // await Promise.all(langs.map(async (lang, i) => {

      //   const langTrls = await getLanguageWords(db, lang.language);
      //   // return await setSuggestions(db, langTrls)

      //   // return setToAlgolia(langTrls)
      // }))

      await verifyPopularWords(langs, db)


      res.send('Completed getting translation data for langs');
    }

    catch(err) {
      console.log('[scrapper]:- Error scrapping', err);
    }

  });
