const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema/index');
const resolvers = require('./resolvers/index');
const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
