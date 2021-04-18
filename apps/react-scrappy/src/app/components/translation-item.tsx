import React, { Fragment } from 'react';
import { ITranslation } from '@ng-scrappy/models';

export default function TranslationItem(props: { trl: ITranslation }) {

  const { trl } = props;
  return (
    <div className="card card-body m-2">
        <div className="d-flex justify-content-between">
          <h4 className="mb-3">{trl.word}</h4>
          <div>
            <small className="badge badge-warning">{trl.language}</small>
          </div>
        </div>
        <p>{trl.meaning}</p>
        <small className="mt-2">
          Use case...
        </small>

    </div>
  )

}

