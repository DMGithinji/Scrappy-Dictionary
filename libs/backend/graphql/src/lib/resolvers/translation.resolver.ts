import * as admin from 'firebase-admin';
import { ApolloError, ValidationError } from 'apollo-server';

import { Language, Translation } from './../schema/translation.interface';
import {
  getLangWords,
  getSupportedLangs,
  searchWord,
} from './../firebase-utils/db-queries';

const db = admin.firestore();

export const resolvers = {
  Query: {
    async translations(_: null, args: { language: string; word: string }) {
      try {
        // Random query for words in a language
        if (args.language) {
          const trls = await getLangWords(db, args.language);
          return trls || new ValidationError('Language not supported');
        }
        // Search for word
        else if (args.word) {
          const results = await searchWord(db, args.word);
          return (
            (results as Translation[]) ||
            new ValidationError('Error during search')
          );
        }
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    async languages() {
      try {
        const langs = await getSupportedLangs(db);
        return langs as Language[];
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};
