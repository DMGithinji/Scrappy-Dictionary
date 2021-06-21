import * as _ from 'lodash';
import * as puppeteer from 'puppeteer';

import { ITranslationLinkData } from '@ng-scrappy/models';

/**
 * Extract word links from provided links
 * @param {string} lang
 * @return {{urls: string[], wordUrls: string[]}}
 */
export const scrapeTrlLinks = async (languages: string[]) => {
  try {
    const letters  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const linkData = languages.map(lang => letters.map(letter =>( { lang, letter})))
    const flat     = _.flatten(linkData) as { lang: string, letter: string }[];

    // Split to chunks to avoid DOS to target site from many concurrent requests
    const chunks   = _.chunk(flat, 9) as { lang: string, letter: string }[][];

    const links: ITranslationLinkData[] = [];

    for (let i=0; i<chunks.length; i++)
    {
      const combinedTrls = await Promise.all(
        chunks[i].map(async (x) => {
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();

          // Configure the navigation timeout
          await page.setDefaultNavigationTimeout(0);

          console.log(
            `Getting translation links from ${x.lang} page - Letter ${x.letter}`
          );
          await page.goto(`https://www.lughayangu.com/${x.lang}/az/${x.letter}`);
          await page.waitForSelector('a', { visible: true });

          await page.exposeFunction('getTrlLinkData', getTrlLinkData);

          const trlLinkData = await page.evaluate(async (lang) => {
            const languageElements = document.querySelectorAll('.word-list');

            const urls = Array.from(languageElements).map((v: HTMLAnchorElement) => v.href);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return await (window as any).getTrlLinkData(urls, lang);
          }, x.lang);

          console.log(
            `${x.lang} - Letter: ${x.letter} - ${trlLinkData.length} trl links scrapped`
          );
          await browser.close();

          return trlLinkData as ITranslationLinkData;
        })
      );

      links.push( _.flatMap(combinedTrls));

    }

    return links;
  } catch (err) {
    console.log(`[scrapeTrlLinks]. Error - ${err}`);
  }
};

/**
 * Extract word links from provided links
 * @param {string} lang
 * @return {{urls: string[], wordUrls: string[]}}
 */
 export const scrapePopularTrlLinks = async (langs: string[]) => {
  try {
    const combinedTrls = await Promise.all(langs.map(async lang => {
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      console.log(`Getting translation links from ${lang} page`);

      await page.goto(`https://www.lughayangu.com/${lang}/`);
      await page.waitForSelector('a', { visible: true });

      await page.exposeFunction('getTrlLinkData', getTrlLinkData);

      const trlLinkData = await page.evaluate(async (lang) => {
        // eslint-disable-next-line no-undef
        const languageElements = document.querySelectorAll('.word-list');

        const urls = Array.from(languageElements).map((v: HTMLAnchorElement) => v.href);

        // eslint-disable-next-line no-undef
        return await (window as any).getTrlLinkData(urls, lang);
      }, lang);

      await browser.close();

      console.log(`${lang}- ${trlLinkData.length} trl links scrapped`);
      return trlLinkData as ITranslationLinkData[];
    }));

    return _.flatMap(combinedTrls) as ITranslationLinkData[];
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

  const trlLinks = [];

  urls.forEach((trlLink) => {
    if (linkIsValid(trlLink)) {
      const word = getWord(trlLink);
      const trlData = { language, word, trlLink };

      trlLinks.push(trlData);
    }
  })

  return (trlLinks as ITranslationLinkData[]).slice(1);
};


/**
 * Validates link before it's added to trlLinkData
 */
 function linkIsValid(trlLink: string) {
  return trlLink.split('/').length === 5;
}

/**
 * @param {string} trlUrl
 * @return {string} Word being translated from url
 */
function getWord(trlUrl: string) {
  return trlUrl.split('/').pop();
}
