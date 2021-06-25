import React from 'react';
import { Link } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';

import { ILanguage } from '@ng-scrappy/models';
import { capitalize } from '../../utils/capitalize.util';

export default function LanguageCard(props: { language: ILanguage }) {
  const langData = props.language;
  const lang = langData;

  return (
    <div className="lang-card">
      <div className="card bg-light border-warning m-3">
        <div className="card-body">
          <h1 className="card-title text-capitalize">
            {lang?.language || <Skeleton width="250" />}
          </h1>
          <p className="card-text text-wrap">
            {lang ? capitalize(lang.description) : <Skeleton count={6} />}
          </p>
        </div>
        <div className="card-footer">
          {lang ? (
            <Link to={`/${lang.language}/words`}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <button className="btn btn-outline-warning">
                    Open dictionary
                  </button>
                </div>
                <small className="text-muted"> {lang.wordCount} words</small>
              </div>
            </Link>
          ) : (
            <Skeleton height={40} width={140} />
          )}
        </div>
      </div>
    </div>
  );
}
