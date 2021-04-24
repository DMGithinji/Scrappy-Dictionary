import React from 'react';

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

export function ActiveLangToggle({ updateActiveLang, activeLang }) {
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
            <button
              onClick={() => updateActiveLang(lang.language)}
              className="dropdown-item bg-transparent"
            >
              {lang.language}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
