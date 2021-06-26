import * as functions from 'firebase-functions';

import algoliasearch from 'algoliasearch';
import { ITranslationResults } from '@ng-scrappy/models';
import { getLanguage } from '../../shared/db';
import { initializeApp } from '../../shared/utils';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const algolia = client.initIndex('dictionary');

const TRANSLATIONS_PATH = 'dictionary/{language}/words/{id}';

const { db } = initializeApp()

/**
 * onCreate handler triggered when translation is added
 * - Will add word count for word's language
 * - Will add document to Algolia
 *
 * Both functionalities could be handled by seperate cloud functions however
 * it would result to too many cloud functions (twice as many), which is costly
 */
export const addToAlgolia = functions.firestore
  .document(TRANSLATIONS_PATH)
  .onCreate(async (snapshot) => {

    const trl = snapshot.data() as ITranslationResults;
    const objectID = snapshot.id;

    await updateWordCount(trl, 'CREATE');

    algolia.saveObject({ ...trl, objectID });
  });


/**
 * onDelete handler triggered when translation is added
 * - Will reduce word count for word's language
 * - Will delete index from algolia
*/
export const deleteFromAlgolia = functions.firestore
  .document(TRANSLATIONS_PATH)
  .onDelete(async (snapshot) => {

    const trl = snapshot.data() as ITranslationResults;

    await updateWordCount(trl, 'CREATE');

    algolia.deleteObject(snapshot.id)
  });


async function updateWordCount(word: ITranslationResults, dbEvent: 'CREATE' | 'DELETE') {
  try {
    const lang = await getLanguage(db, word.language);

    if (!lang.wordCount) {
      lang.wordCount = 0;
    }

    if (dbEvent === 'CREATE') {
      lang.wordCount += 1;
    }

    if (dbEvent === 'DELETE') {
      lang.wordCount -= 1;
    }

  } catch(err) {
    console.log(`Error updating word count:: ${err}`);
  }

}
