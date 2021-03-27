import * as admin from 'firebase-admin';
import { config } from 'firebase-functions';

// Init Firebase Upload
const conf = config().firebase;
admin.initializeApp(conf);

// export all modules.
export * from './app/scrapper/scrapper.function';
