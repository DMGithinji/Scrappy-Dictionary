import * as _ from 'lodash';
import {
  ILanguage,
  ITranslationLinkData,
  ITranslationResults,
} from '@ng-scrappy/models';


/**  Queries a word's translations from the different language collections */
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


/** Queries supported languages */
export async function getSupportedLangs(db: FirebaseFirestore.Firestore) {
  return (queryCollection(db, 'supported-languages') as any) as ILanguage[];
}


/** Queries words in a language collection */
export async function getLanguageWords(db: FirebaseFirestore.Firestore, lang: string, limit: number, cursor: string) {
  const path = `dictionary/${lang}/words`;
  const orderBy =  'word';

  return (queryCollection(db, path, orderBy, limit, cursor) as any) as ITranslationResults[];
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
 * Queries data for the given collection path
 */
export async function queryCollection(
  db: FirebaseFirestore.Firestore,
  collectionPath: string,
  orderBy = 'createdAt',
  limit = 5,
  cursor?: string
) {

  const queryCursor = cursor ?? 0;

  const snapshot = await db.collection(collectionPath)
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
