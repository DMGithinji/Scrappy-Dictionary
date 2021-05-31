import React, { useEffect, useState } from 'react';
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

  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    WORDS_LIST_QUERY,
    {
      variables: { language },
      notifyOnNetworkStatusChange: true,
    }
  );

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

    // HACKY: 900 is the approx height of the list with one request-batch
    const isInRange = ((listHeight - height) < 900);
    const isInitialLoad = (height === 0);

    const loadMoreButton = document.querySelector('#buttonLoadMore');

    if (isInitialLoad || (isInRange && loadMoreButton)) {
      (loadMoreButton as any).click();
    }
  }, [scrollHeight]);

  // Updates cursor for pagination
  const [pointer, setCursor] = useState(null);
  useEffect(() => {
    if (data?.dictionary[0].language === language) {
      const last = data.dictionary[data.dictionary.length - 1];
      const cursor = last.word ?? null;
      const cursorLang = last.language ?? null;
      setCursor({ cursor, cursorLang });
    } else {
      setCursor(null);
    }

    return () => setCursor(null);
  }, [data, language]);

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
          className="m-2 spinner-grow spinner-grow-sm text-dark"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      ))}
    </div>
  );
};
