const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    posts: [Post]
  }

  type Post {
    id: ID!
    userId: ID!
    username: String!
    thePost: String!
    profileImg: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(userId: ID!): User
    posts: [Post]!
    post(id: ID!): Post
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addPost(userId: ID!, username: String!, thePost: String!): Post
    Post(id: ID!, userId: ID!, thePosts: String!): Post
    User(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
