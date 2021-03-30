import { firestore } from 'firebase-admin';
import {
  ITranslationLinkData,
  ITranslationResults,
} from '../interfaces/translation.interface';

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
    .where('word', '==', trlData.word)
    .get();

  return trlRef.empty;
}

/**
 * Gets translation data and save it to DB
 * @param {FirebaseFirestore.Firestore} db
 * @param {ITranslationLinkData} trlData
 * @return {void}
 */
export async function saveTrl(
  db: FirebaseFirestore.Firestore,
  lang: string,
  trlRes: ITranslationResults
) {
  try {
    const repo = await db.collection(`dictionary/${lang}/words`);
    trlRes.createdAt = firestore.Timestamp.now();
    trlRes.language = lang;
    repo.add(trlRes);

    console.log(`[saveTrl]. Saved word - ${trlRes.word}`);
  } catch (err) {
    console.error('[saveTrl]. Error saving translation data - ', err);
  }
}

/**
 * Get's languages to get translations for from db
 * @param {FirebaseFirestore} db
 * @return {string[]} List of languages
 */
export async function getSupportedLangs(db: FirebaseFirestore.Firestore) {
  const snapshot = await firestoreQuery(db, 'supported-languages');
  return snapshot.map((doc) => doc.language);
}

/**
 * Queries given collection path, returns docs within it
 * @param {FirebaseFirestore} db
 * @param {string} collectionPath
 * @return {DocumentData} document data
 */
export async function firestoreQuery(
  db: FirebaseFirestore.Firestore,
  collectionPath: string
) {
  const snapshot = await db.collection(collectionPath).get();
  return snapshot.docs.map((doc) => doc.data());
}
