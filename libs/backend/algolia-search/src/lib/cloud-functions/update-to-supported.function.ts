import { ILanguage } from '@ng-scrappy/models';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const LANGUAGE_PATH = 'dictionary/{id}';
const db = admin.firestore();

/** Will update a language translation supported status based on the no. of votes
 * Once a language is marked 'supported', it will be have it's translations updated weekly */
export const setToSupported = functions.firestore.document(LANGUAGE_PATH)
    .onUpdate(async (change) => {
        const newData = change.after.data() as ILanguage;
        const objectID = change.after.id;

        if (newData.votes >= 10) {
          newData.status = 'supported';
        }

        await db.collection('dictionary')
                .doc(objectID)
                .update(newData);
    });
