import * as puppeteer from 'puppeteer';
import { ITranslationLinkData, ITranslationResults } from '../interfaces/translation.interface';
import { saveTrl } from './db-methods';


/**
 * Gets translation data and save it to DB
 * @param {FirebaseFirestore.Firestore} db
 * @param {ITranslationLinkData} trlData
 * @return {void}
 */
 export async function getAndSave(db: FirebaseFirestore.Firestore, trlData: ITranslationLinkData) {
  try {
    const trlResults = await scrapeTrlData(trlData);

    if (trlResults && trlResults.word && trlResults.meaning) {
      await saveTrl(db, trlData.language, trlResults);
    }
  } catch (err) {
    console.error('[getAndSave]. Error gettng translation data - ', err);
  }
}



/**
 * 1. Visits word url, gets description,
 * @param {string} trlData
 * @return {ITranslationResults}}
 */
export const scrapeTrlData = async (trlData: ITranslationLinkData) => {
  const word = trlData.word;
  const link = trlData.trlLink;
  console.log(`Getting trl data for word: ${word}`);

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Configure the navigation timeout
    await page.setDefaultNavigationTimeout(0);

    await page.goto(link);
    await page.waitForSelector('.en-translation', { visible: true });

    const meaningEl = await page.$('.lang-meaning');
    let meaning = await page.evaluate((el) => el.textContent, meaningEl);
    meaning = cleanText(meaning);

    const egEl = await page.$('.lang-example');
    let example = await page.evaluate((el) => el.textContent, egEl);
    example = removePrefix(cleanText(example));

    const trlEl = await page.$('.en-translation');
    let translation = await page.evaluate((el) => el.textContent, trlEl);
    translation = removePrefix(cleanText(translation));

    const trlResults = { word, link, meaning, example, translation };

    await browser.close();

    return trlResults as ITranslationResults;
  } catch(e) {
    console.error(`Error getting translation data: - ${e} for word there ${trlData.word}`);
  }


};

/**
 * @param {string} txt
 * @return {string} Text with no excess spaces
 */
function cleanText(txt: string) {
  return txt.replace(/\s+/g, ' ').trim();
}

/**
 * @param {string} txt
 * @return {string} Text with no 'eg ' or 'en ' prefix
 */
function removePrefix(txt: string) {
  return txt.split(' ').slice(1).join(' ');
}
