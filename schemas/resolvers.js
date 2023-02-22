const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../Models");
const { Post } = require("../Models");
const { Reply } = require("../Models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },

    addPost: async (_, { userId, thePost, username }) => {
      // const theId = await User.findOne({ _id: userId });
      const clientId = await User.findOne({ username });
      const currentTime = new Date().getTime();

      console.log(currentTime);
      const newPost = await Post.create({
        userId: clientId._id,
        username,
        thePost,
        createdAt: currentTime,
      });
      return { newPost };
    },

    addReply: async (_, { postId, userId, replyText, username }) => {
      // const theId = await User.findOne({ _id: userId });
      // const replies = await Post.findById({_id: postId });
      const user_Id = await User.findOne({ username: userId });
      const currentTime = new Date().getTime();

      console.log(currentTime);
      const newReply = await Reply.create({
        userId: user_Id._id,
        username,
        replyText,
        replyImg: user_Id.profileImg,
        createdAt: currentTime,
      });

      const postReply = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { replies: newReply._id } }
      );
      return { ...postReply };
    },

    addLikes: async (_, { post, username }) => {
      const likedPost = await Post.findOneAndUpdate(
        { _id: post },
        { $inc: { postLikes: 1 }, $push: { likedBy: username } }
      );
      return likedPost;
    },

    removeLikes: async (_, { post, username }) => {
      const dislikedPost = await Post.findOneAndUpdate(
        { _id: post },
        { $inc: { postLikes: -1 }, $pull: { likedBy: username } }
      );
      return dislikedPost;
    },

    addCommentLikes: async (_, { reply, username }) => {
      const likedComment = await Reply.findOneAndUpdate(
        { _id: reply },
        { $inc: { replyLikes: 1 }, $push: { replyLikedBy: username } }
      );
      return likedComment;
    },

    removeCommentLikes: async (_, { reply, username }) => {
      const dislikedComment = await Reply.findOneAndUpdate(
        { _id: reply },
        { $inc: { replyLikes: -1 }, $pull: { replyLikedBy: username } }
      );
      return dislikedComment;
    },

    addFaves: async (_, { post, username }) => {
      const usersFave = await User.findOneAndUpdate(
        { username: username },
        { $push: { faves: post } }
      );
      const favedPost = await Post.findOneAndUpdate(
        { _id: post },
        { $inc: { postFaves: 1 }, $push: { favedBy: username } }
      );
      return favedPost, usersFave;
    },
    removeFaves: async (_, { post, username }) => {
      const removeusersFave = await User.findOneAndUpdate(
        { username: username },
        { $pull: { faves: post } }
      );
      const removefavedPost = await Post.findOneAndUpdate(
        { _id: post },
        { $inc: { postFaves: -1 }, $pull: { favedBy: username } }
      );
      return removefavedPost, removeusersFave;
    },

    addFollow: async (_, { username, following }) => {
      const followID = await User.findOne({ username: following });
      const userFollowed = await User.findOneAndUpdate(
        { _id: followID._id },
        { $push: { followers: username } }
      );
      const myFollows = await User.findOneAndUpdate(
        { username },
        { $push: { following: following } }
      );
      return userFollowed, myFollows;
    },

    unFollow: async (_, { username, following }) => {
      const followID = await User.findOne({ username: following });
      const userFollowed = await User.findOneAndUpdate(
        { _id: followID._id },
        { $pull: { followers: username } }
      );
      const myFollows = await User.findOneAndUpdate(
        { username },
        { $pull: { following: following } }
      );
      return userFollowed, myFollows;
    },

    User: {
      posts: async (user, { userId }) => {
        const thePost = await Post.find({ userId });
        console.log("User post: ", user);
        return { thePost };
      },
    },

    Post: {
      userId: async (post) => {
        return await User.findById(post.userId);
      },
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with that email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError(
          "incorrect password",
          "INCORRECT_PASSWORD"
        );
      }

      const token = signToken(user);
      return { user, token };
    },
  },
  Query: {
    users: async (parent, args, context) => {
      const user = await User.find({});

      return user;
    },
    user: async (_, { username }) => {
      const user = await User.findOne({ username });
      const allPost = await Post.find({ userId: user._id });
      const posts = [...allPost];
      const email = user.email;
      const faves = user.faves;
      const followers = user.followers;
      const following = user.following;
      const eachPost = [];
      const id = [];
      const profileImg = user.profileImg;
      for (let i = 0; i < posts.length; i++) {
        eachPost.push(posts[i]._doc.thePost);
        id.push(posts[i]._doc._id).toString();
      }
      console.log("Following: ", following.length);
      return {
        _id: id,
        thePost: eachPost,
        posts,
        faves,
        following,
        followers,
        username: user.username,
        email,
        profileImg,
      };
    },
    // posts: async({userId}) => {
    //   const thePost = await Post.find({ userId });
    //   console.log("User post: ", userPost)
    //   return {thePost}
    // },
    posts: async () => {
      const allPost = await Post.find({}).populate("replies");
      const eachPost = [];
      const _id = [];
      const thePost = [];
      const userId = [];
      const createdAt = [];
      for (let i = 0; i < allPost.length; i++) {
        const user = await User.findOne({ _id: allPost[i].userId });
        const profileImg = user.profileImg;
        const postWithProfileImg = { ...allPost[i]._doc, profileImg };

        eachPost.push(postWithProfileImg);
        _id.push(allPost[i]._doc._id);
        thePost.push(allPost[i]._doc.thePost);
        createdAt.push(allPost[i]._doc.createdAt);
        userId.push(allPost[i]._doc.userId.toString());
      }
      // console.log(eachPost)
      return eachPost;
    },
    replies: async () => {
      // const allPost = await Post.find({}).populate("replies");
      // return eachPost;
    },
    post: async (_, { _id }) => {
      return await Post.findById(_id);
    },
  },
};

module.exports = resolvers;
