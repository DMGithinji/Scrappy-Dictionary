import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { scrapeTrlLinks } from './utils/trl-links-scrapper';
import { getSupportedLangs, isWordNew } from './utils/db-methods';
import { publishToPubsub } from './utils/pubsub-publisher';


// Init Firebase Upload
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./../../environments/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB'
} as functions.RuntimeOptions;

export const scrappy = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    console.log('Executing scrappy.');

    // Step 1. Get all trl links for each language
    const langs =  await getSupportedLangs(db);

    const trlLinkDataPromises = langs.map((lang: string) => {
      return scrapeTrlLinks(lang);
    });
    const trlLinkData = await Promise.all(trlLinkDataPromises);

    // Step 2. Filter out saved data
    const flattened = _.flatten(trlLinkData);
    const filtered = [];

    await Promise.all(flattened.map(async (data) => {
      if (await isWordNew(db, data)) {
        filtered.push(data);
      }
    }));

    console.log(`Filtered out ${flattened.length - filtered.length} from ${flattened.length} trlLinks`);


    // Step 3. Getting translations and saving
    //         Dividing work to different handlers
    //         because of fxns timing & memory limits
    const trlDataChunks = _.chunk(filtered, 10);

    await Promise.all(trlDataChunks.map(async (chunk) => {
      return await publishToPubsub(chunk, 'dataSaver');
    }));

    res.send('Completed getting translation data for langs');
  });


