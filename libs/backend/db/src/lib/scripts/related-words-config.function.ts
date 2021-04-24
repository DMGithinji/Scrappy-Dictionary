import * as _ from 'lodash';
import { ITranslationResults } from "@ng-scrappy/models";


export async function setSuggestions(db, trlData: ITranslationResults[])
{
  const suggestedWords = _.chunk(trlData.map(t => t.word), 4);
  await Promise.all(trlData.map(async (trl, ind) => {
    const index = (ind % suggestedWords.length);
    let suggested = suggestedWords[index];

    if (suggested.includes(trl.word) && suggested.length !== 4) {
      suggested = suggestedWords.find(chunk => chunk.find(trl => trl.relatedWords.length === 4 && !suggested.includes(trl.word)))
    }

    trl.relatedWords = suggested;
    await update(db, trl)

    return {suggestedWords, suggested};
  }))
}

async function update (db: FirebaseFirestore.Firestore, trlData: ITranslationResults)
{
  await db.collection(`dictionary/${trlData.language}/words`).doc(trlData.id).update(trlData);
  console.log(`Updated trlData of related words of ${trlData.word} to ${trlData.relatedWords}`);
}
