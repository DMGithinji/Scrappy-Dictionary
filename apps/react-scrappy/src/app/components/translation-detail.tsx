import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';

import { capitalize } from '../utils/capitalize.util';


const WORD_QUERY = gql`
  query GetWordTranslation($word: String!) {
    translations(word: $word) {
      word
      language
      meaning
      example
      translation
      relatedWords
    }
  }
`;

export default function TranslationDetail(props) {
  const { loading, error, data } = useQuery(WORD_QUERY, {
    variables: { word: props.match.params.word },
  });

  const trl = data ? data.translations[0] : null as ITranslation;
  const lang = props.match.params.language;

  if (loading || (!trl)) return <p>Loading word...</p>;
  if (error) return <p>Error loading word :(</p>;


  return(
    <div className="mr-2 ml-2 card bg-light">
      <div className="card-header d-flex justify-content-between">
        <div className=" text-muted">Translation</div>
        <div><span className="badge badge-warning">{lang}</span></div>
      </div>
      <div className="card-body">
        <h2 className="card-title">{capitalize(trl.word)}</h2>
        <p className="card-text">{trl.meaning ? capitalize(trl.meaning) : `😬 Meaning wasn't provided`}</p>
      </div>

      <hr/>

      <div className="card-body">
        <p className="text-muted">Example</p>
        <p>{trl.example ? capitalize(trl.example) : `😞 No example available.`}</p>
        <p className="text-muted">Translated to...</p>
        <p>{trl.translation ? capitalize(trl.translation) : `😒 No translation provided!`}</p>
      </div>

      <div className="card-body">
        <p className="text-muted">Related Words</p>

        <div className="list-group list-group-flush m-0 p-0">
          {trl.relatedWords.map((word, i) =>
            <Link to={`/${lang}/word/${word.toLowerCase()}`}>
              <span key={word} className="list-group-item pl-2 text-secondary">{capitalize(word)}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )

}
