import { gql } from 'apollo-server';

export const scrapperTypeDefs = gql`
  type Translation {
    word: String!
    language: String
    meaning: String!
    example: String
    translation: String
    relatedWords: [String]
  }

  type Language {
    language: String!
    description: String!
    popular: [String]
  }

  type Query {
    dictionary(language: String, word: String): [Translation]
    languages: [Language]
  }
`;
