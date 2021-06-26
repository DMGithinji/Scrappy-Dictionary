import { firestore } from 'firebase-admin';
import { ILanguage, ITranslationLinkData, ITranslationResults } from '@ng-scrappy/models';

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
    return ((await repo.add(trlRes)) as any) as ITranslationResults;
  } catch (err) {
    console.error('[saveTrl]. Error saving translation data - ', err);
  }
}

/** Adds word not to be scraped for translation to db */
export async function addToBlacklist(
  db: FirebaseFirestore.Firestore,
  trlLinkData: ITranslationLinkData
) {
  const repo = await db.collection(
    `dictionary/${trlLinkData.language}/blacklisted`
  );
  trlLinkData.word = trlLinkData.word.toLowerCase();
  await repo.add(trlLinkData);
}

/**
 * Updates a language's votes
 */
 export async function setVote(db: FirebaseFirestore.Firestore, lang: string) {
  console.log('Setting Vote In DB.');

  const languagesRepo = db.collection('dictionary');

  const snapshot = await languagesRepo.where('language', '==', lang).get();
  // .then((langs) => langs[0].data() ?? null);
  const langs = (snapshot.docs.map((doc) => doc.data()) as any) as ILanguage;
  const votedLang = langs[0] ?? null;

  if (!votedLang) {
    return { error: 'Voted language not found' };
  }

  votedLang.votes = votedLang.votes + 1;
  await languagesRepo.doc(votedLang.language).update(votedLang);

  return votedLang;
}
