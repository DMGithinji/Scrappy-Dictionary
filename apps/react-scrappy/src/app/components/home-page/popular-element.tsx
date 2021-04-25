import React from 'react';
import { Link } from 'react-router-dom';
import { capitalize } from '../../utils/capitalize.util';
import { getAsLink, setAsWord } from '../../utils/space-fixer.util';

export default function PopularElement(props: {
  language: string;
  word: string;
}) {
  const { word, language } = props;

  return (
    <div className="m-3 mb-0">
      <Link to={`/${language}/word/${getAsLink(word)}`}>
        <button className="btn btn-outline-warning nowrap">{setAsWord(word)}</button>
      </Link>
    </div>
  );
}
