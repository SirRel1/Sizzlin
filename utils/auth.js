const jwt = require("jsonwebtoken");
require('dotenv').config()

const secret = process.env.SECRET || "terrell";
const expiration = "1h";

module.exports = {
  signToken: function ({ username, email, profilePic, password }) {
    const payload = { username, email, profilePic, password };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
