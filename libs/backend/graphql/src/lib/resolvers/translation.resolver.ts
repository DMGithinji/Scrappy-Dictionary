import * as admin from 'firebase-admin';
import { ApolloError, ValidationError } from 'apollo-server';

import { ILanguage, ITranslation } from '@ng-scrappy/models';
import {
  getLanguageWords,
  getSupportedLangs,
  searchWord,
} from '@ng-scrappy/backend/db';

const db = admin.firestore();

export const resolvers = {
  Query: {
    async dictionary(_: null, args: { language: string; word: string, limit: number, cursor: string }) {
      try {
        const limit = args.limit ?? 10;
        const cursor = args.cursor ?? null;

        if (args.language) {
          const trls = await getLanguageWords(db, args.language, limit, cursor);
          return trls || new ValidationError('Language not supported');
        }
        // Search for word
          const results = await searchWord(db, args.word);
          return (
            (results as ITranslation[]) ||
            new ValidationError('Error during search')
          );
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
