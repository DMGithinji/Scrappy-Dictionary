import { capitalize } from './capitalize.util';

/** Handles converting words with spaces to give the correct link format */
export const getAsLink = (word: string) => {
  return word.split(' ').join('-');
};

/** Inverse of the above
 * Some words with spaces were saved with '-' in db
 * This corrects how they are displayed  */
export const setAsWord = (word: string) => {
  const formatted = word.split('-').join(' ');
  return capitalize(formatted);
};
