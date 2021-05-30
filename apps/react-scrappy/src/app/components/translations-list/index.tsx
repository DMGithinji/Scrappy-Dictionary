import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';

import { ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import { useScroll } from './useScroll';
import Error from './../error';
import { WORDS_LIST_QUERY } from '../../queries/translations.queries';

export function TranslationList(props) {
  const language = props.match.params.language;
  const limit = 5;
  const scrollHeight = useScroll();

  const { loading, error, data, fetchMore, networkStatus  } = useQuery(WORDS_LIST_QUERY, {
    variables: { language },
    notifyOnNetworkStatusChange: true,
  });

  // Trigger loader animation
  const [isLoading, setLoader] = useState(false);
  useEffect(() => {
    const isLoading = networkStatus === 3 || loading;
    setLoader(isLoading);

    return () => setLoader(false);
  }, [networkStatus, loading]);

  // Trigger infinite scroll
  useEffect(() => {
    const list = document.getElementById('list');
    const listHeight = list.clientHeight + list.offsetTop;
    const height = scrollHeight.y + window.screenY;

    // HACKY: 800 is the approx height of the list with one request-batch
    const isInRange = (listHeight - height) < 800;
    const initial = (height === 0);

    const loadMoreButton = document.querySelector("#buttonLoadMore");

    if (initial || isInRange && loadMoreButton) {
      (loadMoreButton as any).click();
    }
  }, [scrollHeight]);


  // Updates cursor for pagination
  const [cursor, setCursor] = useState(null);
  useEffect(() => {
    if (data?.dictionary[0].language === language) {
      const latest = data.dictionary[data.dictionary.length - 1]?.word ?? null;
      setCursor(latest);
    } else {
      setCursor(null);
    }

    return () => setCursor(null);
  }, [data, language]);


  if (error) return <Error />;


  return (
    <div id="list">
      { (data)
          ? data.dictionary.map((trl: ITranslation) => ( <TranslationCard key={trl.word} trl={trl} />))
          : [...Array(5)].map((x, i) => (<TranslationCard key={i} trl={null} />))}

      <div className="row d-flex justify-content-center">
        {isLoading
          ? <Loader />
          : <div
              className="btn btn-warning d-none"
              id="buttonLoadMore"
              onClick={() =>
                fetchMore({
                  variables: {
                    cursor,
                    language,
                    limit
                  },
                })
              }
            >
              Load More
            </div>
          }
      </div>
    </div>
  );
}


const Loader = () => {
  return (
    <div>
      <div className="m-2 spinner-grow spinner-grow-sm text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-secondary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-danger" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-warning" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-info" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="m-2 spinner-grow spinner-grow-sm text-dark" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
