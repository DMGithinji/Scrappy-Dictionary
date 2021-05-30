import * as _ from 'lodash';

import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  useLocation,
  withRouter,
} from 'react-router-dom';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import { SkeletonTheme } from 'react-loading-skeleton';
import styles from './app.module.scss';
import logo from './../assets/images/logo.png';

import {
  ActiveLangToggle,
  HomePage,
  SearchComponent,
  TranslationList,
  TranslationDetail,
} from './components';


export const LanguageContext = React.createContext({
  activeLang: 'swahili',
  setLanguage: (() => {
    // Set default
  }) as any,
});


const getLang = (dictionary) => dictionary[0]?.language ?? null;
const isValid = (dictionary) => !!dictionary.length;
const client = new ApolloClient({
  uri: 'https://us-central1-cloudfunc-101.cloudfunctions.net/scrappyApi',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          dictionary: {
            keyArgs: false,
            merge(existing = [], incoming) {
              if (
                isValid(incoming) &&
                getLang(incoming) === getLang(existing)
              ) {
                const dictionary = [...existing, ...incoming];
                return _.uniqBy(dictionary, (x) => x.word);
              }
              return incoming;
            },
          },
        },
      },
    },
  }),
});


function _ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}
const ScrollToTop = withRouter(_ScrollToTop);

export const App = () => {
  const language = localStorage.getItem('scrappy_active_lang') ?? 'swahili';
  const [activeLang, setLanguage] = useState(language);
  const value = { activeLang, setLanguage };

  useEffect(() => {
    localStorage.setItem('scrappy_active_lang', activeLang);
  }, [activeLang]);

  return (
    <ApolloProvider client={client}>
      <Router>
        <ScrollToTop>
          <LanguageContext.Provider value={value}>
            <div className="container">
              <ActiveLangToggle />

              <div className={styles.app}>
                <header className="mb-4">
                  <Link to={`/${activeLang}`}>
                    <div className="d-flex justify-content-center align-items-center">
                      <img className="logo" src={logo} alt="logo" />
                      <h1 className="text-warning"> Scrappy Dictionary </h1>
                    </div>
                  </Link>
                </header>
                <div className="pb-2">
                  <SearchComponent />
                </div>
                <SkeletonTheme color="#fff" highlightColor="#e1e1e1">
                  <main>
                    <Route exact path="/">
                      <Redirect to={`/${activeLang}`} />
                    </Route>
                    <Route exact path="/:language" component={HomePage} />
                    <Route
                      exact
                      path="/:language/words"
                      component={TranslationList}
                    />
                    <Route
                      exact
                      path="/:language/word/:word"
                      component={TranslationDetail}
                    />
                  </main>
                </SkeletonTheme>
              </div>
            </div>
          </LanguageContext.Provider>
        </ScrollToTop>
      </Router>
    </ApolloProvider>
  );
};

export default App;
