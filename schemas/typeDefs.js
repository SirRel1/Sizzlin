const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    password: String!
    profileImg: String
    posts: [Post]
    faves: [ID]
    followers: [String]
    following: [String]
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
    favedBy: [String]
  }

  type Reply {
    _id: ID
    postId: ID
    userId: ID
    username: String
    replyText: String
    replyImg: String
    createdAt: String
    replyLikedBy: [String]
    replyLikes: Int
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
    addCommentLikes(reply: ID!, username: String!): Reply
    addFaves(post: ID!, username: String!): Post
    addFollow(following: String!, username: String!): User
    unFollow(following: String!, username: String!): User
    removeFaves(post: ID!, username: String!): Post
    removeLikes(post: ID!, username: String!): Post
    removeCommentLikes(reply: ID!, username: String!): Reply 
    addReply(
      userId: ID!
      postId: ID!
      username: String!
      replyText: String!
      replyImg: String!
    ): Reply
    Post(_id: ID!, userId: ID!, thePosts: String!): Post
    Reply(_id: ID!, userId: ID!, replyText: String): Reply
    User(
      username: String!
      email: String!
      password: String!
      profileImg: String!
    ): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
