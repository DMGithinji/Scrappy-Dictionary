import * as _ from 'lodash';
import { ILanguage, ITranslationResults } from '@ng-scrappy/models';

/**  Queries a word's translations from the different language collections */
export async function searchWord(
  db: FirebaseFirestore.Firestore,
  word: string
) {
  const langObjs = await getLanguages(db, 'supported');
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

/** Queries supported languages */
export async function getLanguages(
  db: FirebaseFirestore.Firestore,
  status: 'supported' | 'not-supported' | 'scraping',
  limit = 47
) {
  const snapshot = await db
    .collection('dictionary')
    .where('status', '==', status)
    .limit(limit)
    .get();

  return (snapshot.docs.map((doc) => doc.data()) as any) as ILanguage[];
}

/** Queries words in a language collection */
export async function getLanguageWords(
  db: FirebaseFirestore.Firestore,
  lang: string,
  orderBy = 'word',
  limit?: number,
  cursor?: string
) {
  const path = `dictionary/${lang}/words`;
  const order = orderBy ?? 'word';

  return (queryCollection(
    db,
    path,
    order,
    limit,
    cursor
  ) as any) as ITranslationResults[];
}

/**
 * Check's if word exists
 * Returns true if it doesn't exist
 */
export async function shouldAdd(
  db: FirebaseFirestore.Firestore,
  trlData: { language: string; word: string }
) {
  const trlRef = await db
    .collection(`dictionary/${trlData.language}/words`)
    .where('word', '==', trlData.word.toLowerCase())
    .get();

  const blacklistRef = await db
    .collection(`dictionary/${trlData.language}/blacklisted`)
    .where('word', '==', trlData.word.toLowerCase())
    .get();

  return trlRef.empty && blacklistRef.empty;
}

/**
 * Queries data for the given collection path
 */
export async function queryCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  orderBy = 'createdAt',
  limit,
  cursor?: string
) {
  limit = limit ?? 5;
  const queryCursor = cursor ?? 0;

  const snapshot = await db
    .collection(collectionPath)
    .orderBy(orderBy)
    .startAfter(queryCursor)
    .limit(limit)
    .get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
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
