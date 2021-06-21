import { firestore } from 'firebase-admin';
import { ITranslationLinkData, ITranslationResults } from '@ng-scrappy/models';


/** Save translation data to DB */
export async function saveTrl(
  db: FirebaseFirestore.Firestore,
  lang: string,
  trlRes: ITranslationResults
) {
  try {
    const repo = await db.collection(`dictionary/${lang}/words`);

    trlRes.word = trlRes.word.toLowerCase();
    trlRes.language = lang;
    trlRes.createdAt = firestore.Timestamp.now();

    console.log(`[saveTrl]. Saving word - ${trlRes.word}`);
    return await repo.add(trlRes) as any as ITranslationResults;

  } catch (err) {
    console.error('[saveTrl]. Error saving translation data - ', err);
  }
}


/** Adds word not to be scrapped for translation to db */
export async function addToBlacklist(
  db: FirebaseFirestore.Firestore,
  trlLinkData: ITranslationLinkData
) {
  const repo = await db.collection(`dictionary/${trlLinkData.language}/blacklisted`);
  trlLinkData.word = trlLinkData.word.toLowerCase();
  await repo.add(trlLinkData);
}
