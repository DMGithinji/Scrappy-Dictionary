// Popular words are some times missing from the default
// search areas that the data is scrapped ie
// the page words are arranged alphabetically
// and the popular language words
// Here is a script to scrape and add the translation if missing

import { ILanguage, ITranslationLinkData } from "@ng-scrappy/models";
import { isWordNew } from "@ng-scrappy/backend/db";
import { getAndSave } from "../utils/trl-details-scrapper";



export async function verifyPopularWords(languages: ILanguage[], db: FirebaseFirestore.Firestore)
{
  await Promise.all(languages.map(async (l) => {
    const language = l.language;
    const popWords = l.popular;

     return await Promise.all(popWords.map(async word => {
      const trlLink = `https://www.lughayangu.com/${language}/${word}`;
      const trlLinkData = { word, language, trlLink } as ITranslationLinkData
      const shouldScrape = await isWordNew(db, trlLinkData);
      if (shouldScrape) {
        await getAndSave(db, trlLinkData);
      }
    }))
  }));
}
