import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  location: String,
  description: String,
  picturePath: String,
  userPicturePath: String,
  videoPath: String,
  likes: {
    type: Map,
    of: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      comment: String,
      userId: {
        type: String,
        required: true,
      },
      userName: String,
      userPicturePath: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
