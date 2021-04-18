import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ITranslation } from '@ng-scrappy/models';


const WORD_QUERY = gql`
  query GetWordTranslation($word: String!) {
    translations(word: $word) {
      word
      language
      meaning
      example
      translation
    }
  }
`;

export default function TranslationDetail(props) {
  const { loading, error, data } = useQuery(WORD_QUERY, {
    variables: { word: props.match.params.word },
  });


  if (loading) return <p>Loading word...</p>;
  if (error) return <p>Error loading word :(</p>;

  const trl = data ? data.translations[0] : {};

  return(
      <div className="card m-5">
        <div className="card p-4">
          <h4>{trl.word}</h4>
        </div>
      </div>
  )

}
