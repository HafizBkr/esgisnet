import express from "express";
import { getFeedPosts, getUserPosts, likePost, commentPost, updatePost, getPostCreatedAt } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);

router.patch("/:postId", verifyToken, updatePost);
router.patch("/:postId/createdAt", verifyToken, getPostCreatedAt);

export default router;
