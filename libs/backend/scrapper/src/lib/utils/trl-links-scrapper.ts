import * as _ from 'lodash';
import * as puppeteer from 'puppeteer';

import { ITranslationLinkData } from '@ng-scrappy/models';

/**
 * Extract word links from provided links
 * @param {string} lang
 * @return {{urls: string[], wordUrls: string[]}}
 */
export const scrapeTrlLinks = async (lang: string) => {
  try {
    // TODO: Chunk requests for A-Z to split to different PUBSUBS and
    //       DON'T run function with all letters at once to avoid DDOS
    const letters = ["A", "B"];

    const combinedTrls = await Promise.all(
      letters.map(async (l) => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Configure the navigation timeout
        await page.setDefaultNavigationTimeout(0);

        console.log(
          `Getting translation links from ${lang} page - Letter ${l}`
        );
        await page.goto(`https://www.lughayangu.com/${lang}/az/${l}`);
        await page.waitForSelector('a', { visible: true });

        await page.exposeFunction('getTrlLinkData', getTrlLinkData);

        const trlLinkData = await page.evaluate(async (lang) => {
          const languageElements = document.querySelectorAll('a');

          const urls = Array.from(languageElements).map((v) => v.href);

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return await (window as any).getTrlLinkData(urls, lang);
        }, lang);

        console.log(
          `${lang} - Letter: ${l} - ${trlLinkData.length} trl links scrapped`
        );
        await browser.close();

        return trlLinkData as ITranslationLinkData;
      })
    );

    return _.flatMap(combinedTrls);
  } catch (err) {
    console.log(`[scrapeTrlLinks]. Error - ${err}`);
  }
};

/**
 * Extract word links from provided links
 * @param {string} lang
 * @return {{urls: string[], wordUrls: string[]}}
 */
 export const scrapePopularTrlLinks = async (lang: string) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Getting translation links from ${lang} page`);

    await page.goto(`https://www.lughayangu.com/${lang}/`);
    await page.waitForSelector('a', { visible: true });

    await page.exposeFunction('getTrlLinkData', getTrlLinkData);

    const trlLinkData = await page.evaluate(async (lang) => {
      // eslint-disable-next-line no-undef
      const languageElements = document.querySelectorAll('a');

      const urls = Array.from(languageElements).map((v) => v.href);

      // eslint-disable-next-line no-undef
      return await (window as any).getTrlLinkData(urls, lang);
    }, lang);

    await browser.close();

    console.log(`${lang}- ${trlLinkData.length} trl links scrapped`);
    return trlLinkData as ITranslationLinkData[];
  } catch (err) {
    console.log(`[scrapeTrlLinks]. Error - ${err}`);
    return null;
  }
};

/**
 * Extract the relevant translation links from all provided links
 * @param {string[]} urls
 * @param {string} language
 * @return {{trlLink: string, word: string}[]}
 */
const getTrlLinkData = (urls: string[], language: string) => {
  const initialLimit = `https://www.lughayangu.com/${language}/az/Z`;
  const lowerLimit = 'https://www.lughayangu.com/create';

  const trlLinks = [];
  let startAdding = false;

  for (let i = 0; i < urls.length; i++) {
    const trlLink = urls[i];

    if (trlLink === lowerLimit && startAdding) {
      break;
    }
    if (startAdding) {
      const word = getWord(trlLink);
      const trlData = { language, word, trlLink };
      trlLinks.push(trlData);
    }
    if (!startAdding) {
      startAdding = trlLink === initialLimit;
    }
  }
  return (trlLinks as ITranslationLinkData[]).slice(1);
};

/**
 * @param {string} trlUrl
 * @return {string} Word being translated from url
 */
function getWord(trlUrl: string) {
  return trlUrl.split('/').pop();
}
