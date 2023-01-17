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
      username
      userId
      thePost
      profileImg
      createdAt
    }
  }
`;

