import React from 'react';
import { ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { capitalize, slice } from '../utils/capitalize.util';

export default function TranslationCard(props: { trl: ITranslation }) {

  const { trl } = props;
  const meaning = trl.meaning ? slice(capitalize(trl.meaning), 80) : '';
  return (
    <div className="card card-body m-2">
        <div className="d-flex justify-content-between">
          <h4 className="mb-3">{trl.word}</h4>
          <div>
            <small className="badge badge-warning">{trl.language}</small>
          </div>
        </div>
        <p>{meaning}</p>

        <Link to={`/${trl.language}/word/${trl.word}`} className="btn btn-secondary">
          <small className="mt-2">
            Read more...
          </small>
        </Link>

    </div>
  )

}

