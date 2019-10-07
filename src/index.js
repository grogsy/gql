const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

const resolvers = {
  Query: {
    info: () => "Example API",
    feed: (root, args, ctx, info) => {
      return ctx.prisma.links();
    },
    getUsers: (root, args, ctx, info) => {
      return ctx.prisma.users();
    },
    getCommunitys: (root, args, ctx, info) => {
      return ctx.prisma.communitys();
    },
    getPosts: (root, args, ctx, info) => {
      return ctx.prisma.posts();
    }
  },

  Mutation: {
    post: (root, args, ctx) => {
      const { url, description } = args;
      return ctx.prisma.createLink({
        url,
        description
      });
    },
    createUser: (root, args, ctx) => {
      const { firstName, lastName, email, password, username } = args;
      return ctx.prisma.createUser({
        firstName,
        lastName,
        email,
        password,
        username
      });
    },
    createCommunity: (root, args, ctx) => {
      const { name, category, hasPosts, hasMessages, privacy } = args;
      return ctx.prisma.createCommunity({
        name,
        category,
        hasMessages,
        hasPosts,
        privacy
      });
    },
    login: async (parent, args, ctx, info) => {
      const { email, password } = args;
      const user = await ctx.prisma.user({ email });

      if (!user || password !== user.password) {
        throw new Error("Auth Problem");
      }

      return user;
    },
    createPost: (root, args, ctx, info) => {
      const { user, community, content } = args;

      return ctx.prisma.createPost({
        content,
        user: { connect: { id: user } },
        community: { connect: { id: community } }
      });
    }
  },

  User: {
    posts: (parent, args, ctx) => {
      const { id } = parent;
      return ctx.prisma.user({ id }).posts();
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: request => {
    return { ...request, prisma };
  }
});

server.start(() => console.log(`Server on localhost:4000`));
