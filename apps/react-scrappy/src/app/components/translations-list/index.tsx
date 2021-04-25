import React from 'react';
import { useQuery, gql } from '@apollo/client';

import { ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import Error from './../error';

const WORDS_LIST_QUERY = gql`
  query GetLanguageWords($language: String!) {
    dictionary(language: $language) {
      word
      language
      meaning
    }
  }
`;

export function TranslationList(props) {
  const { loading, error, data } = useQuery(WORDS_LIST_QUERY, {
    variables: { language: props.match.params.language },
  });

  if (error) return <Error />;

  return (
    <div className="d-flex flex-column">
      {data
        ? data.dictionary.map((trl: ITranslation) => (
            <TranslationCard key={trl.word} trl={trl} />
          ))
        : [...Array(10)].map((x, i) => (<TranslationCard key={i} trl={null} />))}
    </div>
  );
}
