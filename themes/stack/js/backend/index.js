'use strict';

// Back-End API
// Module Imports
const {
  GraphQLServer,
} = require('graphql-yoga');
const {
  prisma
} = require('./generated/prisma-client');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
// Resolvers
const resolvers = {
  Query,
  Mutation,
  Subscription,
};
// Server Configuration
const server = new GraphQLServer({
  typeDefs: './js/backend/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  },
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
