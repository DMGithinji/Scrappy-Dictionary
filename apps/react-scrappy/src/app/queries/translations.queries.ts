import { gql } from '@apollo/client';

export const DETAILED_LANGUAGES_QUERY = gql`
  query GetLanguages {
    languages {
      language
      description
      popular
    }
  }
`;

export const SUMMARIZED_LANGUAGES_QUERY = gql`
  query GetLanguages {
    languages {
      language
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
  query GetWordTranslation($word: String!) {
    dictionary(word: $word) {
      word
      language
      meaning
      example
      translation
      relatedWords
    }
  }
`;
