const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../Models");
const { Post } = require("../Models");
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
      const clientId = await User.findOne({ username: userId});
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
      user: async (_, { userId }) => {
        const {username, email,  }= await User.findById(userId);
        const allPost = await Post.find({userId});
        const posts = allPost.map(post => post._doc.thePost.toString());
        const id = allPost.map((post) => post._doc._id.toString().replace('[]', ""));
        
        return {username, email, thePost: posts, id}
      },
      // posts: async({userId}) => {
      //   const thePost = await Post.find({ userId });
      //   console.log("User post: ", userPost)
      //   return {thePost}
      // },
      posts: async () => {
        const allPost = await Post.find({});
        const eachPost = [];
        const id = [];
        const thePost = [];
        const userId = []
        const createdAt = [];
        for(let i = 0; i < allPost.length; i++) {
           const user = await User.findOne({ _id: allPost[i].userId });
           const profileImg = user.profileImg;
           const postWithProfileImg = { ...allPost[i]._doc, profileImg };

          eachPost.push(postWithProfileImg);
          id.push(allPost[i]._doc._id);
          thePost.push(allPost[i]._doc.thePost);
          createdAt.push(allPost[i]._doc.createdAt);
          userId.push(allPost[i]._doc.userId.toString());
        }
        
        return eachPost;
      },
      post: async(_, {_id}) => {
        return await Post.findById(_id);
      }
      
    }

};

module.exports = resolvers;
