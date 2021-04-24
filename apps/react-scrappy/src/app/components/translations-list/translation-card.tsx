import React from 'react';
import { Link } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';

import { ITranslation } from '@ng-scrappy/models';
import { capitalize, slice } from '../../utils/capitalize.util';
import { setAsWord } from '../../utils/space-fixer.util';

export default function TranslationCard(props: { trl: ITranslation }) {
  const { trl } = props;
  const meaning = trl?.meaning ? slice(capitalize(trl.meaning), 80) : '';
  return (
    <div className="card bg-light border-warning card-body m-2 mb-3">
      <div className="d-flex justify-content-between">
        <h4 className="mb-4">{ trl ? setAsWord(trl.word) : <Skeleton width={60} />}</h4>
        <div>
          {trl ? (
            <small className="badge badge-warning">{trl.language}</small>
          ) : (
            <Skeleton width={30} />
          )}
        </div>
      </div>
      <p>{meaning || <Skeleton width={300}/>}</p>

      {trl ? (
        <Link to={`/${trl.language}/word/${trl.word}`} className="link-item">
          <small className="mt-4 text-muted">
            <u>Read more...</u>
          </small>
        </Link>
      ) : (
        <Skeleton width={50} />
      )}
    </div>
  );
}
