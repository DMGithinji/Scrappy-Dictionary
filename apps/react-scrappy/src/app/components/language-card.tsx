import React from 'react';
import { ILanguage, ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { capitalize, slice } from '../utils/capitalize.util';

export default function LanguageCard(props: { language: ILanguage }) {
  const langData = props.language;
  const lang = langData.language;

  return (
    <div className="lang-card">
      <div className="card bg-light border-warning m-2">
        <div className="card-body">
          <h1 className="card-title">{capitalize(lang)}</h1>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
        </div>
        <div className="card-footer">
          <Link to={`/${lang}/words`}>
            <button className="btn btn-outline-warning">Open dictionary</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
