import gql from 'graphql-tag';

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
    votes: Int
  }

  type Query {
    supportedLanguages: [Language]
    unsupportedLanguages: [Language]
    dictionary(language: String, limit: Int, cursor: String): [Translation]
    searchWord(word: String): [Translation]
  }

  type Mutation {
    setLanguageVote(language: String!): LanguageVote!
  }

  type LanguageVote {
    language: String!
  }
`;
