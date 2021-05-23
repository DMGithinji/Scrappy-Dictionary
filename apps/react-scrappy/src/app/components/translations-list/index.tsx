import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';

import { ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import Error from './../error';
import { WORDS_LIST_QUERY } from '../../queries/translations.queries';


export function TranslationList(props) {
  const language = props.match.params.language;
  const limit = 5;
  const cursor = null;

  const { loading, error, data } = useQuery(WORDS_LIST_QUERY, {
    variables: { language: props.match.params.language },
  });

  const [getWords, reload] = useLazyQuery(WORDS_LIST_QUERY, {
    variables: { language, limit, cursor },
  });

  const latest = (data) => data.dictionary[-1]?.word ?? null;


  if (error) return <Error />;


  return (
    <div>
      <div className="d-flex flex-column">
        {data
          ? data.dictionary.map((trl: ITranslation) => (
              <TranslationCard key={trl.word} trl={trl} />
            ))
          : [...Array(5)].map((x, i) => (<TranslationCard key={i} trl={null} />))}
      </div>
      <button onClick={() => getWords({ variables: { language, limit: 10, cursor: latest(data) } })}>
        Get More!
      </button>
    </div>

  );
}
