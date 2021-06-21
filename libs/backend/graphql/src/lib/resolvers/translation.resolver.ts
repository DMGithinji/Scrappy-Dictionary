import * as admin from 'firebase-admin';
import { ApolloError, ValidationError } from 'apollo-server';

import { ILanguage } from '@ng-scrappy/models';
import {
  getLanguageWords,
  getLanguages,
  searchWord,
  setVote
} from '@ng-scrappy/backend/db';

const db = admin.firestore();

export const resolvers = {
  Query: {
    async dictionary(_: null, args: { language: string; limit: number, cursor: string }) {
      try {
        const cursor = args.cursor ?? null;

        if (args.language) {
          const trls = await getLanguageWords(db, args.language, 'word', args.limit, cursor);
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
        return (
          results || new ValidationError('Error during search')
        );
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async supportedLanguages() {
      try {
        const langs = await getLanguages(db, 'supported');
        return langs as ILanguage[];
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    async unsupportedLanguages() {
      try {
        const langs = await getLanguages(db, 'not-supported', 5);
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
        console.log(`VOTE => ${vote}`)
        const res = await setVote(db, vote);
        return res;
      } catch(error)
      {
        throw new ApolloError(error);
      }
    }
  }
};
