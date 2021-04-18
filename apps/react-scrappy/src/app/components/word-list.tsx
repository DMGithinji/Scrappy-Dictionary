import React from 'react';

import { useQuery, gql } from '@apollo/client';

const WORDS_LIST_QUERY = gql`
  query GetLanguageWords {
    translations(language: "swahili") {
      word
      meaning
      translation
      language
    }
  }
`;

export default function WordList({
  lang
}) {
  const { loading, error, data } = useQuery(WORDS_LIST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.translations.map((trl) => (
    <div key={trl.word}>
      <p>{JSON.stringify(trl)}</p>
    </div>
  ));
}
