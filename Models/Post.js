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
      maxlength: 300,
    },

    profileImage: {
      type: String,
    },

    postLikes: {
      type: Number,
      default: 0
    },
    
    postFaves: {
      type: Number,
      default: 0
    },

    likedBy: [
      {
        type: String,
        required: true,
        ref: "Users",
      },
    ],
    favedBy: [
      {
        type: String,
        required: true,
        ref: "Users",
      },
    ],

    replies: [{ type: mongoose.Types.ObjectId, ref: "Reply" }],
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
