const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'real neat descip',
  },
  {
    id: 'link-1',
    url: 'www.google.com',
    description: 'goog',
  },
];

let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `HN API`,
    feed: () => links,
    link: (parent, args) => {
      const { id } = args;
      const l = links.filter(link => link.id === id)[0];
      return l;
    },
  },

  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url,
  },

  Mutation: {
    signup: async (parent, args, context, info) => {
      const user = await context.prisma.createUser({ ...args });
      return { user };
    },
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const { id, url, description } = args;
      for (let i = 0; i < links.length; i++) {
        let thisLink = links[i];
        if (thisLink.id === id) {
          const updatedLink = { id, url, description };
          links[i] = updatedLink;
          return updatedLink;
        }
      }
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});

server.start(() => console.log(`Server on localhost:4000`));
