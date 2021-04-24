import React from 'react';
import { useQuery, gql } from '@apollo/client';

import Skeleton from 'react-loading-skeleton';

import { ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { capitalize } from '../../utils/capitalize.util';
import { setAsWord } from '../../utils/space-fixer.util';


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

export function TranslationDetail(props) {
  const { loading, error, data } = useQuery(WORD_QUERY, {
    variables: { word: props.match.params.word },
  });

  const trl = data ? data.translations[0] : null as ITranslation;
  const lang = props.match.params.language;

  const loaded = trl && lang;

  if (error) return <p>Error loading word :(</p>;


  return(
    <div className="m-2 pb-3 card bg-light">
      <div className="card-header pb-0 d-flex justify-content-between">
        <p className="text-secondary">{loaded ? 'Translation' : <Skeleton width={80} />}</p>
        <Link to={`/${lang}/words`}>
          <span className="badge badge-warning">{loaded ? lang : <Skeleton width={40} />}</span>
        </Link>
      </div>
      <div className="card-body">
        <h2 className="card-title">{loaded ? setAsWord(trl.word) : <Skeleton width={100} />}</h2>
        <p className="card-text">{loaded ? (trl.meaning ? capitalize(trl.meaning) : `😬 Meaning wasn't provided`) : <Skeleton count={2} width={350} className="d-block mb-2"/>}</p>
      </div>

      <hr/>

      <div className="card-body mb-0">
        <p className="text-muted">{loaded ? 'Example' : <Skeleton width={100} />}</p>
        <p>{loaded ? (trl.example ? capitalize(trl.example) : `😞 No example available.`) : <Skeleton />}</p>
        <p className="text-muted">{loaded ? 'Translated to...' : <Skeleton width={200} />}</p>
        <p>{loaded ? (trl.translation ? capitalize(trl.translation) : `😞 No example available.`) : <Skeleton />}</p>
      </div>

      <hr/>

      <div className="card m-3 bg-light border-secondary">
        <p className="text-secondary p-2 mb-0">{loaded ? 'Related Words' : <Skeleton width={150} />}</p>

        <div className="list-group list-group-flush m-0 p-0">
          {loaded ?
            (trl.relatedWords.map((word, i) =>
            <Link to={`/${lang}/word/${word.toLowerCase()}`}>
              <u key={word} className="list-group-item pl-2 text-dark">{capitalize(word)}</u>
            </Link>))
            : <Skeleton count={4} height={14} width={45} className={'ml-2 mb-3 mt-3 d-block'}/>}
        </div>
      </div>
    </div>
  )

}
