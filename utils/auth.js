const jwt = require("jsonwebtoken");
require('dotenv').config()

const secret = process.env.SECRET || "terrell";
const expiration = "1h";

module.exports = {
  signToken: function ({ username, email, password }) {
    const payload = { username, email, password };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
