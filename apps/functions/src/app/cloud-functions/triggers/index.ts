/**
 * Cloud functions that trigger an action
 * eg start scrapping or updates to some db data
 */

export { handleTrlCreate, handleTrlDelete } from './trl-change-handler.firestore.function';
export { updateSupportedLangs } from './update-supported-langs.firestore.function';
export { scheduleScrape } from './schedule-scrape.cron.function'

export { cleanDuplicates } from './clean-duplicates.https.function'
