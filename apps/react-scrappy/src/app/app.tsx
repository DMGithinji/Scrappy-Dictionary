import React, { Component } from 'react';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

import WordList from './components/word-list';
import styles from './app.module.scss';

const client = new ApolloClient({
  uri: 'http://localhost:5000/cloudfunc-101/us-central1/scrappyApi',
  cache: new InMemoryCache()
});


export class App extends Component {

  activeLanguage = 'swahili';

  render() {

    return (
      <ApolloProvider client={client}>

        <div className={styles.app}>

          <header>

            <div className="d-flex justify-content-center align-items-center">
              <img
                className="logo"
                src="https://img.icons8.com/bubbles/50/000000/book.png"
              />
              <h1> Scrappy Dictionary </h1>
            </div>

          </header>

          <main>
            <WordList lang={this.activeLanguage} />
          </main>

        </div>

      </ApolloProvider>
    )
  }
}



export default App;
