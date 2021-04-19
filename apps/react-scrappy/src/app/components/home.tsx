import React, { Fragment } from 'react';
import { useQuery, gql } from '@apollo/client';
import { ILanguage, ITranslation } from '@ng-scrappy/models';
import TranslationCard from './translation-card';
import { capitalize } from '../utils/capitalize.util';
import { Link } from 'react-router-dom';
import LanguageCard from './language-card';

const WORDS_LIST_QUERY = gql`
  query GetLanguageWords($language: String!) {
    translations(language: $language) {
      word
      language
      meaning
    }
  }
`;

const LANGUAGES_QUERY = gql`
  query GetLanguages {
    languages {
      language
    }
  }
`;

export default function Home(props) {
  const { loading, error, data } = useQuery(WORDS_LIST_QUERY, {
    variables: { language: props.match.params.language },
  });

  const langsData = useQuery(LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = langsData?.data?.languages ?? [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const lang = props.match.params.language;
  const otherLangs = supportedLangs.filter(l => l.language !== lang)

  return (
    <div>
      <div className="card  bg-light border-warning m-2">
        <span className="card-header text-warning">Active</span>
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

      <hr />

      <div className="jumbotron bg-light border-secondary m-2">
        <h5 className="text-center text-muted">More Languages</h5>

        <div className="scrolling-wrapper d-flex mt-2 pb-2 pt-2">
          {otherLangs.map((lang: ILanguage) => (
            <LanguageCard key={lang.language} language={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
