import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import LanguageCard from './language-card';
import PopularElement from './popular-element';
import { capitalize } from '../../utils/capitalize.util';

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
      description
      popular
    }
  }
`;

export function HomePage(props) {
  const { loading, error, data } = useQuery(WORDS_LIST_QUERY, {
    variables: { language: props.match.params.language },
  });

  const langsData = useQuery(LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = langsData?.data?.languages ?? [];

  const lang = props.match.params.language;
  const activeLang = supportedLangs.find((l) => l.language === lang);
  const otherLangs = supportedLangs.filter((l) => l.language !== lang);

  if (loading || !activeLang) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="card  bg-light border-warning m-2">
        <span className="card-header text-warning">Language</span>
        <div className="card-body">
          <h1 className="card-title">{capitalize(lang)}</h1>
          <p className="card-text">{capitalize(activeLang.description)}</p>
        </div>
        <div className="card-footer">
          <Link to={`/${lang}/words`}>
            <button className="btn btn-outline-warning">Open dictionary</button>
          </Link>
        </div>
      </div>

      <hr />

      <div className="card bg-light border-light m-2 p-3">
        <h5 className="text-center text-dark text-capitalize">
          Popular {lang} Searches
        </h5>

        <div className="scrolling-wrapper d-flex mt-2">
          {activeLang.popular.map((word) => (
            <PopularElement key={lang.word} language={lang} word={word} />
          ))}
        </div>
      </div>

      <hr />

      <div className="jumbotron bg-light border-secondary m-2">
        <h5 className="text-center text-dark">More Languages</h5>

        <div className="scrolling-wrapper d-flex mt-2 pb-2 pt-2">
          {otherLangs.map((lang: ILanguage) => (
            <LanguageCard key={lang.language} language={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
