import React from 'react';
import { ITranslation } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';

export default function TranslationCard(props: { trl: ITranslation }) {

  const { trl } = props;
  return (
    <div className="card card-body m-2">
        <div className="d-flex justify-content-between">
          <h4 className="mb-3">{trl.word}</h4>
          <div>
            <small className="badge badge-warning">{trl.language}</small>
          </div>
        </div>
        <p>{slice(capitalize(trl.meaning), 80)}</p>

        <Link to={`/word/${trl.word}`} className="btn btn-secondary">
          <small className="mt-2">
            Explore more...
          </small>
        </Link>

    </div>
  )

}

const capitalize = (sentence: string) => {
  return sentence.slice(0, 1).toUpperCase() + sentence.slice(1,);
}

const slice = (sentence: string, limit: number) => {
  if (sentence.length <= limit) {
    return sentence;
  }

  return sentence.slice(0, limit) + '...'
}

