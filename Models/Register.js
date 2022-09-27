const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const registerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
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
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
  },
  { timestamps: true }
);

registerSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

registerSchema.methods.createJWT = function () {
  return jwt.sign({userId:this._id}, 'jwtSecret', {expiresIn: '1d'})
};

const Register = model("Register", registerSchema);

module.exports = Register;
