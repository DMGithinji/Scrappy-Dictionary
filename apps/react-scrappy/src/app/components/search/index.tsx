import React from 'react';
import { Link } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

import './search-component.scss';

const appId = process.env.NX_ALGOLIA_APP_ID;
const searchKey = process.env.NX_ALGOLIA_SEARCH_KEY;

const algoliaClient = algoliasearch(appId, searchKey);

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (
      requests.every(({ params }) => !params.query || params.query.length < 2)
    ) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
        })),
      });
    }

    return algoliaClient.search(requests);
  },
};

const resetResults = () => {
  const list = document.getElementsByClassName('ais-SearchBox-reset')[0] as HTMLButtonElement;
  list.click();
};

export function SearchComponent() {
  return (
    <div>
      <InstantSearch searchClient={searchClient} indexName="dictionary">
        <SearchBox
          className="search-box m-2"
          translations={{ placeholder: 'Search word' }}
        />
        <Hits hitComponent={Hit} />
      </InstantSearch>
    </div>
  );
}

const Hit = ({ hit }) => (
  <Link to={`/${hit.language}/word/${hit.word.toLowerCase()}`}>
    <div
      className="list-group-item d-flex justify-content-between align-items-center"
      onClick={(e) => resetResults()}
    >
      <span className="text-white">{hit.word}</span>
      <span className="badge badge-warning badge-pill text-light">
        {hit.language}
      </span>
    </div>
  </Link>
);
