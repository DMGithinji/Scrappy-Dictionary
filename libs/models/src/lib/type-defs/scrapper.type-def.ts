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
    languages: [Language]
    dictionary(language: String, limit: Int, cursor: String): [Translation]
    searchWord(word: String): [Translation]
  }
`;
