import * as admin from 'firebase-admin';
import { ApolloError, ValidationError } from 'apollo-server';

import { ILanguage, ITranslation } from '@ng-scrappy/models';
import {
  getLangWords,
  getSupportedLangs,
  searchWord,
} from '@ng-scrappy/backend/db';

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
            (results as ITranslation[]) ||
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
        return langs as ILanguage[];
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};
