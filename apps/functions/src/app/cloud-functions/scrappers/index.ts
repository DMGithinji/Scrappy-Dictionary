/**
 * Cloud functions that do the actual web scrapping
 */

export { getTranslationLinks, GET_TRL_LINKS_PUBSUB_TOPIC } from './get-trl-links.pubsub.function';
export { getTranslations, GET_TRL_PUBSUB_TOPIC } from './get-translations.pubsub.function';
