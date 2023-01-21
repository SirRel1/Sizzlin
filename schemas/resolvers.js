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

    addPost: async (_, { userId, thePost, username}) => {
      // const theId = await User.findOne({ _id: userId });
      const clientId = await User.findOne({ username });
      const currentTime = new Date().getTime();
      
      console.log(currentTime)
      const newPost = await Post.create({
         userId: clientId._id,
         username,
         thePost,
         createdAt: currentTime
      });
      return { newPost };
    },
    
    addReply: async (_, { postId, userId, replyText, username}) => {
      // const theId = await User.findOne({ _id: userId });
      // const replies = await Post.findById({_id: postId });
      const user_Id = await User.findOne({userId})
      const currentTime = new Date().getTime();
      
      console.log(currentTime)
      const newReply = await Reply.create({
         userId: user_Id._id,
         username,
         replyText,
         repliedAt: currentTime
      });

      const postReply = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { replies: newReply._id } }
      );
      return { ...postReply };
    },

    User: {
      posts: async(user,{userId}) => {
        const thePost = await Post.find({ userId });
        console.log("User post: ", user);
        return {thePost}
      }
    },

    Post: {
      userId: async(post) => {
        return await User.findById(post.userId)
      }
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
        const user = await User.findOne({username});
        const allPost = await Post.find({ userId: user._id});
        const posts = [...allPost];
        const email = user.email
        const eachPost = [];
        const id = [];
        for (let i = 0; i < posts.length; i++) {
          eachPost.push(posts[i]._doc.thePost)
          id.push(posts[i]._doc._id).toString();
        }

        return {_id: id, thePost: eachPost, posts, username: user.username, email}
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
        const userId = []
        const createdAt = [];
        for(let i = 0; i < allPost.length; i++) {
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
      post: async(_, {_id}) => {
        return await Post.findById(_id);
      }
      
    }

};

module.exports = resolvers;
