import React from 'react';
import { useLocation } from 'react-router-dom';

import { useQuery, gql } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';

const LANGUAGES_QUERY = gql`
  query GetLanguages {
    languages {
      language
    }
  }
`;

const setActiveLang = (lang) =>
  localStorage.setItem('scrappy_active_lang', lang);

export function ActiveLangToggle() {
  const location = useLocation();
  const activeLang = location.pathname.split('/')[1];
  const langsData = useQuery(LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = langsData?.data?.languages ?? [];
  const otherLangs = supportedLangs.filter((l) => l.language !== activeLang);

  return (
    <div className="dropdown m-0 d-flex justify-content-end">
      <p
        className="badge badge-light dropdown-toggle text-warning text-capitalize mt-3 mb-0 p-2 "
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        role="button"
      >
        {activeLang} 📌 &nbsp;
      </p>
      <div
        className="dropdown-menu dropdown-menu-right"
        aria-labelledby="dropdownMenuButton"
      >
        {otherLangs.map((lang) => (
          <Link to={`/${lang.language}`}>
            <span
              onClick={() => setActiveLang(lang.language)}
              className="dropdown-item bg-transparent"
            >
              {lang.language}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
