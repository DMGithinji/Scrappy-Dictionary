import * as _ from 'lodash';


/**
 * Queries a word's translations from the different lang collections
 * @param {FirebaseFirestore} db
 * @return {string[]} List of languages
 */
 export async function searchWord(db: FirebaseFirestore.Firestore, word: string) {
  const langObjs = await getSupportedLangs(db);
  const langs = langObjs.map(obj => obj.language);

  console.log(langs);
  const res = await Promise.all(
    langs.map(async (lang) => {
      const snapshot = await db
        .collection(`dictionary/${lang}/words`)
        .where('word', '==', word)
        .get();
      return snapshot.docs.map((doc) => doc.data());
    }))
    console.log(JSON.stringify(res));

    return _.flatMap(res);
}


/**
 * Queries words in a language collection
 * @param {FirebaseFirestore} db
 * @return {string[]} List of Translation Objects
 */
 export async function getLangWords(db: FirebaseFirestore.Firestore, lang: string) {
  return  await queryCollection(db, `dictionary/${lang}/words`);
}


/**
 * Queries supported languages
 * @param {FirebaseFirestore} db
 * @return {string[]} List of languages
 */
 export async function getSupportedLangs(db: FirebaseFirestore.Firestore) {
  return await queryCollection(db, 'supported-languages');
}


/**
 * Queries data for the given collection path
 * @param {FirebaseFirestore} db
 * @param {string} collectionPath
 * @return {DocumentData} document data
 */
 export async function queryCollection(db: FirebaseFirestore.Firestore, collectionPath: string) {
  const snapshot = await db.collection(collectionPath).get();
  return snapshot.docs.map((doc) => doc.data());
}
