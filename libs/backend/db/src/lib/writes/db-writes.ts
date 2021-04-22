import { firestore } from 'firebase-admin';
import { ITranslationLinkData, ITranslationResults } from '@ng-scrappy/models';


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

    trlRes.word = trlRes.word.toLowerCase();
    trlRes.createdAt = firestore.Timestamp.now();
    trlRes.language = lang;

    await repo.add(trlRes);

    console.log(`[saveTrl]. Saved word - ${trlRes.word}`);
  } catch (err) {
    console.error('[saveTrl]. Error saving translation data - ', err);
  }
}


/**
 * Adds word not to be scrapped for translation to db
 * @param db
 * @param trlLinkData
 */
export async function addToBlacklist(
  db: FirebaseFirestore.Firestore,
  trlLinkData: ITranslationLinkData
) {
  const repo = await db.collection(`blacklisted-words`);
  trlLinkData.word = trlLinkData.word.toLowerCase();
  await repo.add(trlLinkData);
}
