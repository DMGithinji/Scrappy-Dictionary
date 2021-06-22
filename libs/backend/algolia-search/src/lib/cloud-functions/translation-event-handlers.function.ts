import * as functions from 'firebase-functions';
import algoliasearch from 'algoliasearch';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dictionary');

const TRANSLATIONS_PATH = 'dictionary/{language}/words/{id}';

/** Will add document to Algolia on translation being added */
export const addToAlgolia = functions.firestore
  .document(TRANSLATIONS_PATH)
  .onCreate((snapshot) => {
    const data = snapshot.data();
    const objectID = snapshot.id;

    return index.saveObject({ ...data, objectID });
  });

/** Will update indexed document in Algolia on translation being updated */
export const updateToAlgolia = functions.firestore
  .document(TRANSLATIONS_PATH)
  .onUpdate((change) => {
    const newData = change.after.data();
    const objectID = change.after.id;
    return index.saveObject({ ...newData, objectID });
  });

/** Will delete indexed document from Algolia on translation being deleted */
export const deleteFromAlgolia = functions.firestore
  .document(TRANSLATIONS_PATH)
  .onDelete((snapshot) => index.deleteObject(snapshot.id));
