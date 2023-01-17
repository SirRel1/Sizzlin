const { Schema, model, mongoose } = require("mongoose");

const postSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },

    username: {
      type: String,
      required: true,
      ref: "Users",
    },

    thePost: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      maxlength: 150,
    },

    profileImage: {
      type: String
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  {
    toJSON: {
      virtuals: true,
    },
  },
  { timestamps: true }
);

const Post = model("Posts", postSchema);

module.exports = Post;
