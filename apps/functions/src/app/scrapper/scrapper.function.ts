import * as _ from 'lodash';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { scrapeTrlLinks } from './utils/trl-links-scrapper';
import { isWordNew } from './utils/db-methods';
import { ITranslationLinkData } from './interfaces/translation.interface';
import { getAndSave } from './utils/trl-details-scrapper';


// Init Firebase Upload
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('./../../environments/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cloudfunc-101.firebaseio.com',
});

const db = admin.firestore();

export const scrappy = functions.https.onRequest(async (req, res) => {
  console.log('Executing scrappy.');

  // Step 1. Get all trl links for each language
  const langs = ['sheng'];

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

  await Promise.all(filtered.slice(0, 3).map(async (data: ITranslationLinkData) => {
    return await getAndSave(db, data);
  }));
  res.send('Completed getting translation data for langs');
});


