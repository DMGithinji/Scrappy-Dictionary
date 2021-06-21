import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';

import { useQuery } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';

import LanguageCard from './language-card';
import PopularElement from './popular-element';
import Error from './../error';
import { capitalize } from '../../utils/capitalize.util';
import { DETAILED_SUPPORTED_LANGUAGES_QUERY } from '../../queries/translations.queries';
import { LanguageVoteCard } from '../language-vote-card';
import { LanguageContext } from '../../app';


export function HomePage(props) {
  const { loading, error, data } = useQuery(DETAILED_SUPPORTED_LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = data?.supportedLanguages ?? [];

  const { activeLang } = useContext(LanguageContext);
  const lang = supportedLangs.find((l) => l.language === activeLang);
  const otherLangs = supportedLangs.filter((l) => l.language !== activeLang);

  if (error) return <Error />;

  return (
    <div>
      <div className="card bg-light border-warning m-2">
        <span className="card-header text-warning">
          {!loading ? `Language` : <Skeleton width={60} />}
        </span>

        <div className="card-body">
          <h1 className="card-title">
            {!loading ? capitalize(activeLang) : <Skeleton width={250} />}
          </h1>
          <p className="card-text">
            {!loading ? (
              capitalize(lang.description)
            ) : (
              <Skeleton count={7} />
            )}
          </p>
        </div>
        <div className="card-footer">
          <p className="card-text">
            {!loading ? (
              <Link to={`/${activeLang}/words`}>
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
          {!loading ? `Popular ${activeLang} Searches` : <Skeleton width={250} />}
        </h5>

        <div className="scrolling-wrapper d-flex flex-row mt-2">
          {!loading
            ? lang.popular.map((word, i) => (
                <PopularElement key={i} language={activeLang} word={word} />
              ))
            : <Skeleton count={3} height={35} width={90} className={'mr-3 flex-fill'}/>}
        </div>
      </div>

      <hr />

      <div className="jumbotron bg-light border-secondary pt-4 pb-5">
        <h5 className="text-center text-dark">
          {!loading ? 'More Languages' : <Skeleton width={150} />}
        </h5>

        <div className="scrolling-wrapper d-flex pb-1 pt-1">
          {!loading ? (
            otherLangs.map((lang: ILanguage) => (
              <LanguageCard key={lang.language} language={lang} />
            ))
          ) : (
            <LanguageCard language={null} />
          )}
        </div>
      </div>

      <div className="jumbotron bg-light border-secondary pt-4 pb-5">
          <LanguageVoteCard />
        </div>
    </div>
  );
}
