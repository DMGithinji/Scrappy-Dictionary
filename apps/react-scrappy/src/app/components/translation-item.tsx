import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';

interface Translation {
  id: string;
  language: string
  word: string;
  meaning: string;
  example: string;
  translation: string;
  relatedWords: string[];
}

export default function TranslationItem(props: { trl: Translation }) {

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

