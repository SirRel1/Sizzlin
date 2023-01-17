import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation Mutation($userId: ID!, $username: String! $thePost: String!) {
    addPost(userId: $userId, username: $username thePost: $thePost) {
      userId
      username
      thePost
      id
    }
  }
`;
