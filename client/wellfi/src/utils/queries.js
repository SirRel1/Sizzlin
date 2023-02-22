import { gql } from "@apollo/client";

export const CURRENT_USER = gql`
  query singleUser($userId: ID!) {
    user(userId: $userId) {
      id
      username
      email
      
    }
  }
`;

export const QUERY_ME = gql`
  query user {
    users {
      id
      username
      email
      
    }
  }
`;

export const POST_QUERY = gql`
  query Query {
    posts {
      _id
      username
      userId
      thePost
      profileImg
      createdAt
      postLikes
      likedBy
      favedBy
      replies {
        _id
        replyText
        username
        userId
        replyImg
        createdAt
        replyLikedBy
        replyLikes
      }
    }
  }
`;

export const USERPOST_QUERY = gql`
  query user($username: String!) {
    user(username: $username) {
      username
      email
      faves 
      following 
      followers
      profileImg
      posts {
        _id
        thePost
        createdAt
      }
    }
  }
`;

