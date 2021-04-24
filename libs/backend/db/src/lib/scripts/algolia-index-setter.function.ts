import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';
import { ITranslationResults } from '@ng-scrappy/models';


const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dictionary');

export function setToAlgolia(trlData: ITranslationResults[])
{
  trlData.map((trl) => {

    const objectID = trl.id;
    console.log(`Saving obj with word ${trl.word}`)
    return index.saveObject({ ...trl, objectID });
  });
}
