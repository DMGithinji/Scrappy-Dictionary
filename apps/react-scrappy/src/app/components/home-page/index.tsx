import React from 'react';
import { Link } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';

import { useQuery, gql } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';

import LanguageCard from './language-card';
import PopularElement from './popular-element';
import Error from './../error';
import { capitalize } from '../../utils/capitalize.util';

const LANGUAGES_QUERY = gql`
  query GetLanguages {
    languages {
      language
      description
      popular
    }
  }
`;

export function HomePage(props) {
  const { loading, error, data } = useQuery(LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = data?.languages ?? [];

  const lang = props.match.params.language;
  const activeLang = supportedLangs.find((l) => l.language === lang);
  const otherLangs = supportedLangs.filter((l) => l.language !== lang);

  if (error) return <Error />;

  return (
    <div>
      <div className="card  bg-light border-warning m-2">
        <span className="card-header text-warning">
          {!loading ? `Language` : <Skeleton width={60} />}
        </span>

        <div className="card-body">
          <h1 className="card-title">
            {!loading ? capitalize(lang) : <Skeleton width={250} />}
          </h1>
          <p className="card-text">
            {!loading ? (
              capitalize(activeLang.description)
            ) : (
              <Skeleton count={7} />
            )}
          </p>
        </div>
        <div className="card-footer">
          <p className="card-text">
            {!loading ? (
              <Link to={`/${lang}/words`}>
                <button className="btn btn-outline-warning">
                  Open dictionary
                </button>
              </Link>
            ) : (
              <Skeleton height={40} width={140} />
            )}
          </p>
        </div>
      </div>

      <hr />

      <div className="card bg-light border-light m-2 p-3">
        <h5 className="text-center text-dark text-capitalize">
          {!loading ? `Popular ${lang} Searches` : <Skeleton width={250} />}
        </h5>

        <div className="scrolling-wrapper d-flex flex-row mt-2">
          {!loading
            ? activeLang.popular.map((word) => (
                <PopularElement key={lang.word} language={lang} word={word} />
              ))
            : <Skeleton count={3} height={35} width={90} className={'mr-3 flex-fill'}/>}
        </div>
      </div>

      <hr />

      <div className="jumbotron bg-light border-secondary m-2">
        <h5 className="text-center text-dark">
          {!loading ? 'More Languages' : <Skeleton width={150} />}
        </h5>

        <div className="scrolling-wrapper d-flex mt-2 pb-2 pt-2">
          {!loading ? (
            otherLangs.map((lang: ILanguage) => (
              <LanguageCard key={lang.language} language={lang} />
            ))
          ) : (
            <LanguageCard language={null} />
          )}
        </div>
      </div>
    </div>
  );
}
