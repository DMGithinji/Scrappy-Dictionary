import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

import { ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import Error from './../error';
import { WORDS_LIST_QUERY } from '../../queries/translations.queries';
import { useScroll } from '../../hooks/use-scroll.hook';
import { useHistory } from 'react-router-dom';

export function TranslationList() {
  const history = useHistory();
  const language = history.location.pathname.split('/')[1];

  const limit = 6;
  const scrollHeight = useScroll();

  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    WORDS_LIST_QUERY,
    {
      variables: { language },
      notifyOnNetworkStatusChange: true,
    }
  );


  // Updates cursor for pagination
  const [pointer, setCursor] = useState(null);
  useEffect(() => {
    if (data?.dictionary[0].language === language) {
      const last = data.dictionary[data.dictionary.length - 1];

      const cursor = last.word ?? null;
      const cursorLang = last.language ?? null;
      setCursor({ cursor, cursorLang });

    } else {
      setCursor({ cursor: null, cursorLang: language });
    }

    return () => setCursor(null);
  }, [data, language]);


  // Trigger loader animation
  const [isRefetching, setLoader] = useState(false);
  useEffect(() => {
    const isRefetching = networkStatus === 3 || loading;
    setLoader(isRefetching);

    return () => setLoader(false);
  }, [networkStatus, loading]);


  // Trigger infinite scroll
  useEffect(() => {
    const list = document.getElementById('list');
    const listHeight = list.clientHeight + list.offsetTop;
    const height = scrollHeight.y + window.screenY;

    // HACKY: 850 is the approx height of the list with one request-batch
    const isInRange = ((listHeight - height) < 850);
    const isInitialLoad = (height === 0);

    // FIX: When user quickly scrolls down, triggering a load, then up, leads to crash
    setTimeout(() => {
      const loadMoreButton = document.querySelector('#buttonLoadMore');

      if (isInitialLoad || (isInRange && loadMoreButton)) {
        (loadMoreButton as any).click();
      }
    }, 200)
  }, [scrollHeight]);

  if (error) return <Error />;

  return (
    <div id="list">
      {data && (pointer?.cursorLang === data.dictionary[0].language)
        ? data.dictionary.map((trl: ITranslation) => (
            <TranslationCard key={trl.word} trl={trl} />
          ))
        : [...Array(5)].map((x, i) => <TranslationCard key={i} trl={null} />)
      }

      <div className="row d-flex justify-content-center mb-3">
        {isRefetching
          ? (<Loader />)
          : (<div className="btn btn-warning d-none"
                  id="buttonLoadMore"
                  onClick={() =>
                    fetchMore({
                      variables: {
                        cursor: pointer?.cursor,
                        language,
                        limit,
                      },
                    })
                  }
              >
                Load More
              </div>
            )}
      </div>
    </div>
  );
}

const Loader = () => {
  return (
    <div>
      {[...Array(5)].map((x, i) => (
        <div
          key={i}
          className="m-2 spinner-grow spinner-grow-sm text-dark"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </div>
  );
};
