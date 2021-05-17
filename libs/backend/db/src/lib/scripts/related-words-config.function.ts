import * as _ from 'lodash';
import { ITranslationResults } from '@ng-scrappy/models';

/**
 * Sets relatedWords to a tranlation from random existing words in language
 */
export function setRelatedWords(db, trlData: ITranslationResults[]) {
  const suggestedWordsList = _.chunk(trlData.map((t) => t.word), 4);

  return trlData.map(async (trl, ind) =>
  {
    const index = ind % suggestedWordsList.length;
    let related = suggestedWordsList[index];

    const isRelatedInvalid = (trl, suggestions) =>
      trl.relatedWords.length !== 4 || suggestions.includes(trl.word);

    if (isRelatedInvalid(trl, related))
    {
      related = suggestedWordsList.find((sugg) =>
        sugg.find((trl) => !isRelatedInvalid(trl, related)));
    }

    trl.relatedWords = related;
    await update(db, trl);

  })
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
