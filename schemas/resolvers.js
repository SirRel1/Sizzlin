const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../Models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Mutation: {
    addUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
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
};

module.exports = resolvers;
