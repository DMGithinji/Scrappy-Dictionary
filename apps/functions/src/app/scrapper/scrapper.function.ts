import * as functions from 'firebase-functions';
import { scrapeTrlLinks } from './utils/trl-links-scrapper';

export const scrappy = functions.https.onRequest(async (req, res) => {
  console.log('Executing scrappy.');

  const langs = ['sheng'];

  const trlLinkDataPromises = langs.map((lang: string) => {
    return scrapeTrlLinks(lang);
  });
  const trl = await Promise.all(trlLinkDataPromises);
  console.log(trl.slice(2));

  res.send('Completed getting translation data for langs');
});
