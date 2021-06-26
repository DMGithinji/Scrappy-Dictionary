import * as _ from 'lodash';
import * as functions from 'firebase-functions';

import { ITranslationLinkData } from '@ng-scrappy/models';
import { shouldAdd } from './../../shared/db';
import { initializeApp, publishToPubsub } from './../../shared/utils';
import {
  ETLData,
  IScrapeData,
} from './../../shared/interfaces/scrapper.interface';

import {
  scrapePopularTrlLinks,
  scrapeTrlLinks,
} from './utils/trl-links-scrapper';
import { GET_TRL_PUBSUB_TOPIC } from './get-translations.pubsub.function';

export const GET_TRL_LINKS_PUBSUB_TOPIC = 'getTranslationLinks';

const { db } = initializeApp();

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '4GB',
} as functions.RuntimeOptions;

/**
 * 1. Scrapes all the links required for scrapping individial word translation data
 * 2. Fires off pubsub responsible for scraping individual word translation data
 *    for each valid link retrieved
 */
export const getTranslationLinks = functions
  .runWith(runtimeOpts)
  .pubsub.topic(GET_TRL_LINKS_PUBSUB_TOPIC)
  .onPublish(async (message) => {
    console.log('Executing scrappy.');

    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null;

    try {
      const data = JSON.parse(messageBody) as IScrapeData;
      const langs = data.languages;

      // Scrape all links to scrape translation data
      const trlLinkData = await scrapeTrlLinks(langs);
      const popLinkData = await scrapePopularTrlLinks(langs);
      const all = _.uniqBy(
        _.flattenDeep([...trlLinkData, ...popLinkData]),
        (trlData) => trlData.word
      );

      // Filter out saved data/blacklisted words
      const filtered: ITranslationLinkData[] = [];

      await Promise.all(
        all.map(async (data) => {
          if (await shouldAdd(db, data)) {
            filtered.push(data);
          }
        })
      );

      console.log(
        `Filtered out ${all.length - filtered.length} from ${
          all.length
        } trlLinks`
      );

      if (filtered.length) {
        const etlData = {
          trlLinks: filtered,
          // Scrape data important only for initial scraping
          scrapeData: {
            languages: langs,
            isInitialScrape: data.isInitialScrape,
          },
        } as ETLData;

        console.log(
          `Publishing ${etlData.trlLinks.length} to getTranslationsFromLinks`
        );
        await publishToPubsub(etlData, GET_TRL_PUBSUB_TOPIC);
      }
    } catch (err) {
      console.log('[scrapper]:- Error scrapping', err);
    }
  });
