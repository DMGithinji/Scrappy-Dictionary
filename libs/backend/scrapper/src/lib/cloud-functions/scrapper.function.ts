import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { ILanguage, ITranslationLinkData } from '@ng-scrappy/models';
import { getSupportedLangs, isWordNew } from '@ng-scrappy/backend/db';
import { scrapeTrlLinks } from './../utils/trl-links-scrapper';
import { publishToPubsub } from './../utils/pubsub-publisher';
import { getAndSave } from '../utils/trl-details-scrapper';

const config = functions.config().service_account;

admin.initializeApp(config);

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: '1GB',
} as functions.RuntimeOptions;

export const scrappy = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    try {
      console.log('Executing scrappy.');

      // Step 1. Get all trl links for each language
      const langs = await getSupportedLangs(db);

      // TODO: Work of scrapping transaction links should be split to
      //       different pubsubs to avoid timing out especially
      //       if scrapping all the words in alphabet for a language
      //
      //       Maybe don't scrape for all languages at once,
      //       to avoid DDOS, schedule @ different times or run async await
      //       batches manageable for the site
      const trlLinkDataPromises = langs.map((lang: ILanguage) => {
        return scrapeTrlLinks(lang.language);
      });
      const trlLinkData = await Promise.all(trlLinkDataPromises);

      // Step 2. Filter out saved data
      const flattened = _.flatten(trlLinkData) as ITranslationLinkData[];
      const filtered: ITranslationLinkData[] = [];

      await Promise.all(
        flattened.map(async (data) => {
          if (await isWordNew(db, data)) {
            filtered.push(data);
          }
        })
      );

      console.log(
        `Filtered out ${flattened.length - filtered.length} from ${
          flattened.length
        } trlLinks`
      );

      // Step 3. Getting translations and saving
      //         Dividing work to different handlers
      //         because of fxns timing & memory limits
      // const trlDataChunks = _.chunk(filtered, 10) as ITranslationLinkData[][];

      // await Promise.all(
      //   trlDataChunks.map(async (chunk) => {
      //     return await publishToPubsub(chunk, 'dataSaver');
      //   })
      // );

      const chunks = _.chunk(filtered, 8);
      for (let i = 0; i <= chunks.length; i++) {
        if (chunks[i])
          await Promise.all(chunks[i].map(async c => await getAndSave(db, c)));
      }

      res.send('Completed getting translation data for langs');
    }

    catch(err) {
      console.log('[scrapper]:- Error scrapping', err);
    }

  });
