import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Translation {
    word: String!
    language: String
    meaning: String!
    example: String
    translation: String
  }

  type Language {
    language: String!
  }

  type Query {
    translations(language: String, word: String): [Translation]
    languages: [Language]
  }
`;
