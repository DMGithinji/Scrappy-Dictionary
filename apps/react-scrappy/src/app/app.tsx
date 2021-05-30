import * as _ from 'lodash';

import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
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


const getLang = (dictionary) => dictionary[0]?.language ?? null;
const isValid = (dictionary) => !!dictionary.length;
const client = new ApolloClient({
  uri: 'http://localhost:5000/cloudfunc-101/us-central1/scrappyApi',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          dictionary: {
            keyArgs: false,
            merge(existing = [], incoming) {
              if (isValid(incoming) && getLang(incoming) === getLang(existing)) {
                const dictionary = [...existing, ...incoming];
                return _.uniqBy(dictionary, (x) => x.word);
              }
              return incoming;
            }
          },
        },
      },
    },
  }),
});

export class App extends React.Component {
  state = {
    activeLang: localStorage.getItem('scrappy_active_lang') ?? 'swahili',
  };

  updateActiveLang = (lang) => {
    this.setState({ activeLang: lang });
    localStorage.setItem('scrappy_active_lang', lang);
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            <ActiveLangToggle
              updateActiveLang={this.updateActiveLang}
              activeLang={this.state.activeLang}
            />

            <div className={styles.app}>
              <header className="mb-4">
                <Link to={`/${this.state.activeLang}`}>
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
                    <Redirect to={`/${this.state.activeLang}`} />
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
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
