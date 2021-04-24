import React from 'react';
import { ILanguage } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { capitalize } from '../../utils/capitalize.util';

export default function LanguageCard(props: { language: ILanguage }) {
  const langData = props.language;
  const lang = langData;

  return (
    <div className="lang-card">
      <div className="card bg-light border-warning m-3">
        <div className="card-body">
          <h1 className="card-title text-capitalize">{lang.language}</h1>
          <p className="card-text text-wrap">
            {capitalize(lang.description)}
          </p>
        </div>
        <div className="card-footer">
          <Link to={`/${lang.language}/words`}>
            <button className="btn btn-outline-warning">Open dictionary</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
