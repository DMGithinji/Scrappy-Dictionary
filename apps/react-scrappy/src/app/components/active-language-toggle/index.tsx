import React from 'react';

import { useQuery } from '@apollo/client';
import { ILanguage } from '@ng-scrappy/models';
import { Link } from 'react-router-dom';
import { SUMMARIZED_LANGUAGES_QUERY } from '../../queries/translations.queries';


export function ActiveLangToggle({ updateActiveLang, activeLang }) {
  const langsData = useQuery(SUMMARIZED_LANGUAGES_QUERY);
  const supportedLangs: ILanguage[] = langsData?.data?.languages ?? [];
  const otherLangs = supportedLangs.filter((l) => l.language !== activeLang);

  return (
    <div
      className="dropdown m-0 d-flex justify-content-end"
      data-toggle="tooltip"
      data-placement="top"
      title="Change your default language"
    >
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
        {otherLangs.map((lang, i) => (
          <Link to={`/${lang.language}`} key={i}>
            <button
              onClick={() => updateActiveLang(lang.language)}
              className="dropdown-item bg-light text-capitalize"
            >
              {lang.language}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
