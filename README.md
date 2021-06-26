# Scrappy Dictionary 

A project built to explore different technologies I am currently curious about.

It is a PWA of a dictionary of multiple Kenyan languages.
The content is mostly sourced/scraped from [lughayangu.com](https://lughayangu.com), which inspired the project.

I've used an [Nx](https://nx.dev/) monorepo as my intention is to implement the application with different frontend frameworks and state management patterns so as to compare the developer experience and end result between them, as well as learn a few things.

## Backend
The backend uses Cloud Functions for Firebase to implement the following:
- Scrapping [lughayangu.com](https://lughayangu.com) for word translations.
- Saving the data in Firestore.
- Automatically indexing data for full-text search with Algolia.
- Building and hosting a [GraphQL server](https://us-central1-cloudfunc-101.cloudfunctions.net/scrappyApi)
- Scheduled scrapping of requested languages (TODO)

#### Usage
After running   ` yarn install `,

to run cloud functions locally, run:
```
yarn run firebase:serve
```

## Frontend

The frontend and statemanagement frameworks which I intend to use(or have used) include:
- React/GraphQL - Live at [rx-scrappy.web.app](https://rx-scrappy.web.app)
- Angular/GraphQL
- Angular/Akita


#### Usage

To run react app, run:
```
ng serve react-scrappy
```
