import { ITranslationLinkData, ITranslationResults } from '../interfaces/translation.interface';

/**
 * Check's if word exists
 * Returns true if it doesn't exist
 * @param {FirebaseFirestore.Firestore} db
 * @param {ITranslationLinkData} trlData
 * @return {void}
 */
export async function isWordNew(db: FirebaseFirestore.Firestore, trlData: ITranslationLinkData) {
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
 export async function saveTrl(db: FirebaseFirestore.Firestore, lang: string, trlRes: ITranslationResults) {
  try {
    const repo = await db.collection(`dictionary/${lang}/words`);
    repo.add(trlRes);

    console.log(`[saveTrl]. Saved word - ${trlRes.word}`);
  } catch (err) {
    console.error('[saveTrl]. Error saving translation data - ', err);
  }
}
