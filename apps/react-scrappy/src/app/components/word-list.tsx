import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ITranslation } from '@ng-scrappy/models';
import TranslationItem from './translation-item';


const WORDS_LIST_QUERY = gql`
  query GetLanguageWords($language: String!) {
    translations(language: $language) {
      word
      language
      meaning
    }
  }
`;

export default function WordList(props: { lang: string }) {
  const { loading, error, data } = useQuery(WORDS_LIST_QUERY, {
    variables: { language: props.lang },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return(
    <Fragment>
      {data.translations.map((trl: ITranslation) => (
        <TranslationItem key={trl.word} trl={trl} />
      ))}
    </Fragment>
  )

}
