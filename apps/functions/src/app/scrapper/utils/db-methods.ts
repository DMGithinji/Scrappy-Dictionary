import { ITranslationLinkData } from '../interfaces/translation.interface';

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
