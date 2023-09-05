import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, videoPath, createdAt } = req.body;

    if (!userId || !description) {
      return res.status(400).json({ message: "User ID and description are required." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      videoPath,
      createdAt: createdAt || new Date(), // Utiliser la valeur fournie ou la date actuelle
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while creating the post." });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving posts." });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving user posts." });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id || !userId) {
      return res.status(400).json({ message: "Post ID and user ID are required." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while updating the post." });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, userId } = req.body;

    if (!id || !comment || !userId) {
      return res.status(400).json({ message: "Post ID, comment, and user ID are required." });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newComment = {
      comment,
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      userPicturePath: user.picturePath,
    };

    post.comments.push(newComment);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while commenting on the post." });
  }
};



export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { createdAt } = req.body;

    if (!postId || !createdAt) {
      return res.status(400).json({ message: "Post ID and createdAt are required." });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { createdAt },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "An error occurred while updating the post." });
  }
};


export const getPostCreatedAt = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required." });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json({ createdAt: post.createdAt });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while retrieving the post's createdAt." });
  }
};
