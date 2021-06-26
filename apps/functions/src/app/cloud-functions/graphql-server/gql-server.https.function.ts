import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { https } from 'firebase-functions';

import { resolvers } from './resolvers/translations.resolver';
import { scrapperTypeDefs as typeDefs } from '@ng-scrappy/models';

function gqlServer() {
  const app = express();

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    // Enable graphiql gui
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app, path: '/', cors: true });

  return app;
}

const server = gqlServer();

// Graphql api
const scrappyApi = https.onRequest(server);

export { scrappyApi };
