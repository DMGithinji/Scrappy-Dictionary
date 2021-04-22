import * as _ from 'lodash';
import { ILanguage, ITranslation, ITranslationLinkData } from '@ng-scrappy/models';


/**
 * Queries a word's translations from the different lang collections
 * @param {FirebaseFirestore} db
 * @return {string[]} List of languages
 */
 export async function searchWord(
  db: FirebaseFirestore.Firestore,
  word: string
) {
  const langObjs = await getSupportedLangs(db);
  const langs = langObjs.map((obj) => obj.language);

  try {
    const res = await Promise.all(
      langs.map(async (lang) => {
        const snapshot = await db
          .collection(`dictionary/${lang}/words`)
          .where('word', '==', word)
          .get();

        return snapshot.docs.map((doc) => doc.data());
      })
    );

    return _.flatMap(res);
  } catch (e) {
    throw Error(`[searchWord]: - Error querying for word ${word} - ${e}`);
  }
}


/**
 * Queries words in a language collection
 * @param {FirebaseFirestore} db
 * @return {string[]} List of Translation Objects
 */
export async function getLanguageWords(
  db: FirebaseFirestore.Firestore,
  lang: string
) {
  try {
    return await queryCollection(db, `dictionary/${lang}/words`, 'word') as any as ITranslation[];
  } catch (e) {
    throw Error(
      `[getLanguageWords]: - Error querying language words for ${lang} - ${e}`
    );
  }
}


/**
 * Check's if word exists
 * Returns true if it doesn't exist
 * @param {FirebaseFirestore.Firestore} db
 * @param {ITranslationLinkData} trlData
 * @return {void}
 */
export async function isWordNew(
  db: FirebaseFirestore.Firestore,
  trlData: ITranslationLinkData
) {
  const trlRef = await db
    .collection(`dictionary/${trlData.language}/words`)
    .where('word', '==', trlData.word.toLowerCase())
    .get();

  const blacklistRef = await db
    .collection(`blacklisted-words`)
    .where('word', '==', trlData.word.toLowerCase())
    .get();

  return trlRef.empty && blacklistRef.empty;
}


/**
 * Queries supported languages
 * @param {FirebaseFirestore} db
 * @return {string[]} List of languages
 */
 export async function getSupportedLangs(db: FirebaseFirestore.Firestore) {
  return await queryCollection(db, 'supported-languages') as any as ILanguage[];
}


/**
 * Queries data for the given collection path
 * @param {FirebaseFirestore} db
 * @param {string} collectionPath
 * @return {DocumentData} document data
 */
 export async function queryCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  orderProp?: string
) {
  const orderBy = orderProp ?? 'createdAt';
  const snapshot = await db.collection(collectionPath).orderBy(orderBy).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
}
