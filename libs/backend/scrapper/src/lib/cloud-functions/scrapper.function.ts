import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { scrapeTrlLinks } from './../utils/trl-links-scrapper';
import { getSupportedLangs, isWordNew } from './../utils/db-queries';
import { publishToPubsub } from './../utils/pubsub-publisher';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('@ng-scrappy/service-json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB',
} as functions.RuntimeOptions;

export const scrappy = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    console.log('Executing scrappy.');

    // Step 1. Get all trl links for each language
    const langs = await getSupportedLangs(db);

    // TODO: Work of scrapping transaction links should be split to
    //       different pubsubs to avoid timing out especially
    //       if scrapping all the words in alphabet for a language
    //
    //       Maybe don't scrape for all languages at once,
    //       to avoid DDOS, schedule @ different times per language
    const trlLinkDataPromises = langs.map((lang: string) => {
      return scrapeTrlLinks(lang);
    });
    const trlLinkData = await Promise.all(trlLinkDataPromises);

    // Step 2. Filter out saved data
    const flattened = _.flatten(trlLinkData);
    const filtered = [];

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
    const trlDataChunks = _.chunk(filtered, 10);

    await Promise.all(
      trlDataChunks.map(async (chunk) => {
        return await publishToPubsub(chunk, 'dataSaver');
      })
    );

    res.send('Completed getting translation data for langs');
  });
