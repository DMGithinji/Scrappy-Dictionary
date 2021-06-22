import { ILanguage, ITranslationLinkData } from '@ng-scrappy/models';
import { getLanguageWords, shouldAdd } from '@ng-scrappy/backend/db';
import { getAndSave } from '../utils/trl-details-scrapper';

/**
 * Popular words from scraped site are sometimes missing from saved transaltions
 * here we ensure the missing popular words with translations are added
 */
export async function verifyPopularWords(
  language: string,
  db: FirebaseFirestore.Firestore
) {
  // Newly scraped data has scrapped all words' related-words set as the language's popular words
  const randomWord = (await getLanguageWords(db, language))[0];
  const popular = randomWord.relatedWords;

  // Ensure popular words translations have been added
  const popularSaved = await Promise.all(
    popular.map(async (word) => {
      const trlLink = `https://www.lughayangu.com/${language}/${word}`;
      const trlLinkData = { word, language, trlLink } as ITranslationLinkData;
      const isNew = await shouldAdd(db, trlLinkData);
      if (!isNew) {
        return word;
      }
      const saved = await getAndSave(db, trlLinkData);
      if (saved) {
        return saved.word;
      }
    })
  );

  // Set language's popular words to dictionary
  const dictCollection = db.collection('dictionary');
  const dictionary = (await dictCollection
    .doc(language)
    .get()
    .then((snapshot) => snapshot.data())) as ILanguage;

  dictionary.popular = popularSaved.filter((x) => !!x);
  return ((await dictCollection
    .doc(language)
    .update(dictionary)) as any) as ILanguage;
}
