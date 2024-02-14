const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

 let users = [];

// GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    age: Int!
    email: String!
  }

  type Query {
    users: [User]!
  }

  type Mutation {
    createUser(name: String!, age: Int!, email: String!): User!
    deleteUser(id: ID!): User
  }
`;

 const resolvers = {
  Query: {
    users: () => users,
  },
  Mutation: {
    createUser: (_, { name, age, email }) => {
      const id = String(users.length + 1);
      const newUser = { id, name, age, email };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        const deletedUser = users.splice(index, 1)[0];
        return deletedUser;
      }
      return null;
    },
  },
};

 const server = new ApolloServer({ typeDefs, resolvers });

 const app = express();

 async function startApolloServer() {
  await server.start();

   server.applyMiddleware({ app });

   const PORT =  4000;

   app.listen(PORT, () =>
    console.log(
      `Server running at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

 startApolloServer().catch((error) => console.error(error));
