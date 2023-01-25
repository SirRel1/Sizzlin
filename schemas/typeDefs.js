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
    _id: ID!
    userId: ID!
    username: String!
    thePost: String!
    replies: [Reply]
    profileImg: String
    postLikes: Int
    likedBy: [String]
    createdAt: String
  }
  
  type Reply {
    _id: ID
    postId: ID
    userId: ID
    username: String
    replyText: String
    replyImg: String
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]!
    user(username: String!): User
    posts: [Post]!
    replies: [Reply]!
    post(id: ID!): Post
    reply(id: ID!): Reply
  }
  

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addPost(userId: ID!, username: String!, thePost: String!): Post
    addLikes(post: ID!, username: String!): Post
    addReply(userId: ID!, postId: ID! username: String!, replyText: String!, replyImg: String!): Reply
    Post(_id: ID!, userId: ID!, thePosts: String!): Post
    Reply(_id: ID!, userId: ID!, replyText: String): Reply
    User(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
