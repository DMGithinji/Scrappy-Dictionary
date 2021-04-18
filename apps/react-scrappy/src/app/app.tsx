import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import TranslationList from './components/translation-list';
import styles from './app.module.scss';
import TranslationDetail from './components/translation-detail';
import Home from './components/home';

const client = new ApolloClient({
  uri: 'http://localhost:5000/cloudfunc-101/us-central1/scrappyApi',
  cache: new InMemoryCache(),
});

export class App extends Component {
  activeLanguage = 'swahili';

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="container">
            <div className={styles.app}>
              <header className="mb-5">
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    className="logo"
                    src="https://img.icons8.com/bubbles/50/000000/book.png"
                    alt="logo"
                  />
                  <h1> Scrappy Dictionary </h1>
                </div>
              </header>

              <main>
                <Route exact path="/:language" component={Home} />
                <Route exact path="/:language/words" component={TranslationList} />
                <Route exact path="/:language/word/:word" component={TranslationDetail} />
              </main>
            </div>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
