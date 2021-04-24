import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Redirect, Route } from 'react-router-dom';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import styles from './app.module.scss';

import {  ActiveLangToggle,  HomePage, SearchComponent,  TranslationList, TranslationDetail } from './components';

const client = new ApolloClient({
  uri: 'http://localhost:5000/cloudfunc-101/us-central1/scrappyApi',
  cache: new InMemoryCache(),
});

export class App extends Component {
  activeLang = localStorage.getItem('scrappy_active_lang') ?? 'swahili';

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            <ActiveLangToggle />

            <div className={styles.app}>
              <header className="mb-4">
                <Link to={`/${this.activeLang}`}>
                  <div className="d-flex justify-content-center align-items-center">
                    <img
                      className="logo"
                      src="https://img.icons8.com/bubbles/50/000000/book.png"
                      alt="logo"
                    />
                    <h1 className="text-warning"> Scrappy Dictionary </h1>
                  </div>
                </Link>
              </header>

              <div className="pb-2">
              <SearchComponent />
              </div>

              <main>
                <Route exact path="/">
                  <Redirect to={`/${this.activeLang}`} />
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
            </div>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
