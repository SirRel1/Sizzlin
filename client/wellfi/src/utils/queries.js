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
    user {
      _id
      username
      email
    }
  }
`;

