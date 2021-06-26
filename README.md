# Scrappy Dictionary

A dictionary PWA of common Kenyan languages. 

The dictionary's content is scraped from the site [lughayangu.com](https://www.lughayangu.com/), which crowd sources the words and translations from the public.

I built this project to learn more deeply some of the concepts I frequently apply specifically in serverless design as well as practice on some technologies I have been curious about/keen to learn more about (such as GraphQL and using React Hooks).


### Code structure

The codebase is set up as a [Nx](https://nx.dev) monorepo comprising of a React app, Angular app and a Firebase Cloud Functions backend.
I chose to use Nx mainly because:
- It enables consistent commands to serve, build, and lint each app from one place.
- It facilitates code sharing across different applications.

The [React application](https://rx-scrappy.web.app) communicates with a graphql server hosted on a cloud function to query the scraped data stored in Firestore.

The [Angular application](https://ng-scrappy.web.app) uses the Firebase SDK to query the data from Firestore.

The Cloud functions included are primarily responsible for:

1. Performing extract-transform-load (ETL) process ie web scrapping the target site for content, formatting the data and saving it to Firebase Firestore.
2. Triggering the ETL process ie based on a scheduled cronjob, or when user votes (*to add a candidate language to the app*) have reached a particular threshold.
3. Writing data to [Algolia](https://www.algolia.com/) for full-text search capabilities, whenever a new word is added/deleted.
4. Hosting a [GraphQL server](https://us-central1-cloudfunc-101.cloudfunctions.net/scrappyApi) to query data from firestore.


Each of the applications code can be found within the `apps` directory and the shared code can be found in the `libs` directory.



### Running project locally
1. Clone the repository
2. Install the project dependencies by running either `yarn install` or `npm install`,
3. Set up firebase cloud functions. To do this;
   - make sure you have NodeJS setup in your computer.
   - you'll need a firebase account to run cloud functions with firebase. You can create one from [firebase.google.com](https://firebase.google.com/) if you don't have one.
   - you'll need to install firebase cli tools `npm install -g firebase-tools` and login to the cli `firebase login`
   - you'll need to create a new firebase project in your account to link this project to.
  (Read more about setting up a firebase project from [here](https://firebase.google.com/docs/functions/get-started).)

   
Some preliminary data (*information of the languages targeted for web scraping*) was also manually added to firestore prior to initializing web scraping.
![screenshots/manually-added-data.png](screenshots/manually-added-data.png)
An example of the info added. In this case, the data was set under the path `dictionary/kiembu`


### Notes
- Firebase [pricing](https://firebase.google.com/pricing) is quite generous. You can build powerful applications while still within the free tier threshold.
- To avoid slowing down the target site during web scraping, I limited the number of concurrent requests to 10.
- Due to the large no. of word translations being scraped and the limited execution time a cloud function has, I limited the no. of translations a single cloud function invocation did (*to around 50*), after which it would pass on the remainder of the translations to a new invocation of the function.
- I used a graphql server to query data from firestore primarily for learning purposes. 
I would however not recommend this approach since it is noticeably slower, resulting mainly from cloud function cold starts. It's simpler and faster to use the SDK provided by firestore as intended.
- I learnt a ton, some the highlights that stood out for me involved my newfound understanding of:
  -  Cloud functions, some of their limitations and some work arounds to overcome those limitations.
  -  React Hooks.
  -  Basic [GraphQL principles](https://www.apollographql.com/docs/apollo-server/getting-started/).
  -  Using [Apollo graphql client](https://www.apollographql.com/docs/react/) in react.
  -  [Puppetteer](https://www.npmjs.com/package/puppeteer) (what was used for web scraping). It is a powerful library that has multiple usecases for anything that can be done via a browser.  
