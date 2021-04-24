import React from 'react';
import { ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { capitalize, slice } from '../../utils/capitalize.util';

export default function TranslationCard(props: { trl: ITranslation }) {

  const { trl } = props;
  const meaning = trl.meaning ? slice(capitalize(trl.meaning), 80) : '';
  return (
    <div className="card bg-light border-warning card-body m-2 mb-3">
        <div className="d-flex justify-content-between">
          <h4 className="mb-4">{trl.word}</h4>
          <div>
            <small className="badge badge-warning">{trl.language}</small>
          </div>
        </div>
        <p>{meaning}</p>

        <Link to={`/${trl.language}/word/${trl.word}`} className="link-item">
          <small className="mt-4 text-muted">
            <u>Read more...</u>
          </small>
        </Link>

    </div>
  )

}

