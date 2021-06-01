import { gql } from '@apollo/client';

export const DETAILED_SUPPORTED_LANGUAGES_QUERY = gql`
  query GetLanguages {
    supportedLanguages  {
      language
      description
      popular
    }
  }
`;

export const SUMMARIZED_SUPPORTED_LANGUAGES_QUERY = gql`
  query GetSupportedLanguages {
    supportedLanguages {
      language
    }
  }
`;

export const SUMMARIZED_UNSUPPORTED_LANGUAGES_QUERY = gql`
  query GetUnsupportedLanguages {
    unsupportedLanguages {
      language
      votes
    }
  }
`;

export const WORDS_LIST_QUERY = gql`
  query GetLanguageWords($language: String!, $limit: Int, $cursor: String) {
    dictionary(language: $language, limit: $limit, cursor: $cursor) {
      word
      language
      meaning
    }
  }
`;

export const TRANSLATION_DETAILS_QUERY = gql`
  query GetWordTranslation($word: String) {
    searchWord(word: $word) {
      word
      language
      meaning
      example
      translation
      relatedWords
    }
  }
`;
