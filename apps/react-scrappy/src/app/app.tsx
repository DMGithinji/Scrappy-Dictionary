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

import {
  ActiveLangToggle,
  HomePage,
  SearchComponent,
  TranslationList,
  TranslationDetail,
} from './components';

const client = new ApolloClient({
  uri: 'https://us-central1-cloudfunc-101.cloudfunctions.net/scrappyApi',
  cache: new InMemoryCache(),
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
              <SkeletonTheme color="#fff" highlightColor="#f3f3f3">
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
    )
  }
}

export default App;
