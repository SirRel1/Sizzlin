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
      _id
      userId
      username
      thePost
    }
  }
`;

export const ADD_REPLY = gql`
  mutation Mutation($postId: ID!, $userId: ID!, $username: String!, $replyText: String!, $replyImg: String!) {
    addReply(postId: $postId, userId: $userId, username: $username, replyText: $replyText, replyImg: $replyImg) {
      postId
      userId
      username
      replyText
      replyImg
    }
  }
`;

export const ADD_LIKES = gql`
  mutation Mutation($post: ID!, $username: String!) {
    addLikes(post: $post, username: $username) {
      username
      likedBy
      postLikes
    }
  }
`;

export const SUB_LIKES = gql`
  mutation Mutation($post: ID!, $username: String!) {
    removeLikes(post: $post, username: $username) {
      username
      likedBy
      postLikes
    }
  }
`;

export const ADD_COMMENT_LIKES = gql`
  mutation Mutation($reply: ID!, $username: String!) {
    addCommentLikes(reply: $reply, username: $username) {
      username
      replyLikedBy
      replyLikes
    }
  }
`;

export const REMOVE_COMMENT_LIKES = gql`
  mutation Mutation($reply: ID!, $username: String!) {
    removeCommentLikes(reply: $reply, username: $username) {
      username
      replyLikedBy
      replyLikes
    }
  }
`;

export const ADD_FAVE = gql`
  mutation Mutation($post: ID!, $username: String!) {
    addFaves(post: $post, username: $username) {
      username
      favedBy
      
    }
  }
`;

export const REMOVE_FAVE = gql`
  mutation Mutation($post: ID!, $username: String!) {
    removeFaves(post: $post, username: $username) {
      username
      favedBy
      
    }
  }
`;

export const ADD_FOLLOW = gql`
  mutation Mutation($following: String!, $username: String!) {
    addFollow(following: $following, username: $username) {
      username
      following
    }
  }
`;

export const REMOVE_FOLLOW = gql`
  mutation Mutation($following: String!, $username: String!) {
    unFollow(following: $following, username: $username) {
      username
      following
    }
  }
`;
