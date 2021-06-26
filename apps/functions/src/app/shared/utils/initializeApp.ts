import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * Ensures application is initialized (only once) for functions to run
 *
 * Returns the app instance and the applications db
 */
export function initializeApp() {
  const config = functions.config().service_account;

  let app: admin.app.App;

  if (!admin.apps.length) {
    app = admin.initializeApp(config);
  } else {
    app = admin.apps[0];
  }

  const db = admin.firestore();

  return { app, db };
}
