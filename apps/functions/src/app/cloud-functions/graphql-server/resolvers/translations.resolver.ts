import { ApolloError, ValidationError } from 'apollo-server';

import { ILanguage, LanguageStatus } from '@ng-scrappy/models';
import {
  getLanguageWords,
  getLanguages,
  searchWord,
  setVote,
} from '../../../shared/db';
import { initializeApp } from '../../../shared/utils';

const { db } = initializeApp();

export const resolvers = {
  Query: {
    async dictionary(
      _: null,
      args: { language: string; limit: number; cursor: string }
    ) {
      try {
        const cursor = args.cursor ?? null;

        if (args.language) {
          const trls = await getLanguageWords(
            db,
            args.language,
            'word',
            args.limit,
            cursor
          );
          return trls || new ValidationError('Language not supported');
        }

        return new ValidationError('No language passed');
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async searchWord(_: null, args: { word: string }) {
      try {
        // Search for word
        const results = await searchWord(db, args.word);
        return results || new ValidationError('Error during search');
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async supportedLanguages() {
      try {
        const langs = await getLanguages(db, LanguageStatus.Supported);
        return langs as ILanguage[];
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async unsupportedLanguages() {
      try {
        const langs = await getLanguages(db, LanguageStatus.Unsupported, 5);
        return langs as ILanguage[];
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
  Mutation: {
    async setLanguageVote(_: null, args: { language: string }) {
      try {
        const vote = args.language;
        const res = await setVote(db, vote);
        return res;
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
};
