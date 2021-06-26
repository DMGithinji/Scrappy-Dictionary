import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import { getLanguages, getLanguageWords } from '../../shared/db';
import { initializeApp } from '../../shared/utils';

const { db } = initializeApp();

export const cleanDuplicates = functions.https.onRequest(async (req, res) => {
  try {
    console.log('[cleanDuplicates]:- Executing cleanDuplicates.');

    // Step 1. Get all trl links for each language
    const langs = await getLanguages(db, 'scraping');

    await Promise.all(
      langs.map(async (lang) => {
        const langTrls = await getLanguageWords(
          db,
          lang.language,
          'word',
          2000
        );
        console.log(`[cleanDuplicates]:- Language ${lang.language}`);

        const toDel = [];

        const group = _.groupBy(langTrls, (t) => t.word);
        console.log(`${Object.keys(group).length} unique words`);

        Object.keys(group).forEach((k) => {
          if (group[k].length > 1) {
            toDel.push(group[k].slice(1));
          }
        });
        console.log(`${toDel.length} repeated words`);

        const repo = db.collection(`dictionary/${lang.language}/words`);
        await Promise.all(
          _.flatten(toDel).map(async (w) => {
            return repo.doc(w.id).delete();
          })
        );
      })
    );

    res.send(
      '[cleanDuplicates]:- Completed getting translation data for langs'
    );
  } catch (err) {
    console.log('[cleanDuplicates]:- Error cleaning duplicates ::', err);
  }
});
