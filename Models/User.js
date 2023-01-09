const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },

    password: {
      type: String,
      required: true,
    }

    // profilePic: {
    //   type: String,
    //   required: false
    // }
  },

  {
    toJSON: {
      virtuals: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign({userId:this._id}, 'jwtSecret', {expiresIn: '1d'})
};

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


const Users = model("Users", userSchema);

module.exports = Users;
