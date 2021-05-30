import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';

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

  const [isLoading, setLoader] = useState(false);
  useEffect(() => {
    const isLoading = networkStatus === 3 || loading;
    setLoader(isLoading);

    return () => setLoader(false);
  }, [networkStatus, loading]);


  const observerRef = useRef(null);
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

  const [buttonRef, setButtonRef] = useState(null);
  useEffect(() => {
    if (buttonRef && !isLoading) {
      // observerRef.current.observe(document.querySelector("#buttonLoadMore"));
    }
  }, [buttonRef, isLoading]);

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


  if (error) {
    console.log(error);
    return <div>Error</div>;
  }


  if (error) return <Error />;


  return (
    <div style={{height: "1000px"}}>
      <div id="list" className="d-flex flex-column">
        { (data)
           ? data.dictionary.map((trl: ITranslation) => ( <TranslationCard key={trl.word} trl={trl} />))
           : [...Array(5)].map((x, i) => (<TranslationCard key={i} trl={null} />))}

        <div className="row d-flex justify-content-center">
          {isLoading
            ? <Loader />
            : <div
                className="btn btn-warning"
                ref={setButtonRef}
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
