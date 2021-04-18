import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { ITranslationLinkData } from '@ng-scrappy/models';
import { getAndSave } from './../utils/trl-details-scrapper';

const db = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB',
} as functions.RuntimeOptions;

export const dataSaver = functions
  .runWith(runtimeOpts)
  .pubsub.topic('dataSaver')
  .onPublish(async (message) => {
    try {
      const messageBody = message.data
        ? Buffer.from(message.data, 'base64').toString()
        : null;

      const toTrl = JSON.parse(messageBody) as ITranslationLinkData[];

      await Promise.all(
        toTrl.map(async (data) => {
          return await getAndSave(db, data);
        })
      );
    } catch (e) {
      console.log('[dataSaver]. Error while calling  pub function - ', e);
    }
  });
