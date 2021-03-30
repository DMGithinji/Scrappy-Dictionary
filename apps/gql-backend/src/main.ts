import { ApolloServer } from 'apollo-server';
import { resolvers } from './app/translation.resolver';
import { typeDefs } from './app/schema/translation.typeDef';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

server.listen({ port: process.env.PORT || 4003 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
