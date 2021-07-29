const { ApolloServer } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { PubSub } = require('apollo-server');

const fs = require('fs');
const path = require('path');

const { getUserId } = require('./utils');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const resolvers = {
	Query,
	Mutation,
	User,
	Link,
	Subscription,
	Vote
};

const prisma = new PrismaClient();

const pubsub = new PubSub();

const typeDefs = fs.readFileSync(
	path.join(__dirname, 'schema.graphql'),
	'utf8'
);
// creating the context as a function which returns the context
const context = ({ req }) => {
	return {
		...req,
		prisma,
		pubsub,
		userId: req && req.headers.authorization ? getUserId(req) : null,
	};
};
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context,
});

server.listen().then(({ url }) => console.log('Server running on:', url));
