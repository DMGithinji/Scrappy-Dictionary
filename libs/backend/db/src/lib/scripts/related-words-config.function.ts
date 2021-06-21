import * as _ from 'lodash';
import { ITranslationResults } from '@ng-scrappy/models';

/**
 * By default, scraped translations from one language have same related words - which is boring
 * here we scramble related-words to random translated words
 */
export async function scrambleRelatedWords(db, trlData: ITranslationResults[]) {
  const suggested = _.chunk(trlData.map((t) => t.word), 4);

  return await Promise.all(trlData.map(async (trl, i) =>
  {
    const index = i % suggested.length;
    let related = suggested[index];

    const isValid = (trl, suggestions) => !suggestions.includes(trl.word) || trl.relatedWords.length === 4;

    let x = 0;
    while(!isValid(trl, related) && x < suggested.length)
    {
      const random = Math.floor(Math.random() * suggested.length);
      related = suggested[random];
      x++;
    }

    trl.relatedWords = related;
    return update(db, trl);

  }));
}

/** Updates the db */
async function update(
  db: FirebaseFirestore.Firestore,
  trlData: ITranslationResults
) {
  db.collection(`dictionary/${trlData.language}/words`)
    .doc(trlData.id)
    .update(trlData);
}
