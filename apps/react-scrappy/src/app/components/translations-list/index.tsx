import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';

import { ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import Error from './../error';
import { WORDS_LIST_QUERY } from '../../queries/translations.queries';


export function TranslationList(props) {
  const language = props.match.params.language;
  const limit = 5;

  const { loading, error, data, fetchMore, networkStatus  } = useQuery(WORDS_LIST_QUERY, {
    variables: { language },
    notifyOnNetworkStatusChange: true,
  });


  const latest = (data) => data?.dictionary[data.dictionary.length - 1]?.word ?? null;


  const observerRef = useRef(null);
  const [buttonRef, setButtonRef] = useState(null);

  useEffect(() => {
    const options = {
      root: document.querySelector("#list"),
      threshold: 0.1,
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        (entry.target as any).click();
      }
    }, options);
  }, []);

  useEffect(() => {
    if (buttonRef) {
      observerRef.current.observe(document.querySelector("#buttonLoadMore"));
    }
  }, [buttonRef]);



  if (error) {
    console.log(error);
    return <div>Error</div>;
  }

  const isRefetching = networkStatus === 3;

  if (error) return <Error />;


  return (
    <div style={{height: "1000"}}>
      <div id="list" className="d-flex flex-column">
        { (data)
           ? data.dictionary.map((trl: ITranslation) => ( <TranslationCard key={trl.word} trl={trl} />))
           : [...Array(5)].map((x, i) => (<TranslationCard key={i} trl={null} />))}

        <div className="row">
          <div
            className="btn btn-warning"
            ref={setButtonRef}
            id="buttonLoadMore"
            onClick={() =>
              fetchMore({
                variables: {
                  cursor: latest(data),
                  language,
                  limit
                },
              })
            }
          >
            load more
          </div>
        </div>
      </div>

    </div>
  );
}
