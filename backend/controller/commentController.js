const Comment = require("../models/comment");
const Post = require("../models/Post");
const createNotification = require("../utils/createNotification");

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: req.params.postId,
      author: req.user.id,
      text,
    });

    // Push comment to post
    post.comments.push(comment._id);
    await post.save();
    await createNotification(
      post.author,
      req.user.id,
      "comment",
      post._id
    );

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username avatar");

    res.status(201).json({
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL COMMENTS OF A POST
const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar");

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LIKE / UNLIKE COMMENT
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isLiked = comment.likes.includes(req.user.id);

    if (isLiked) {
      comment.likes.pull(req.user.id);
      await comment.save();
      res.status(200).json({ message: "Comment unliked", likes: comment.likes });
    } else {
      comment.likes.push(req.user.id);
      await comment.save();
      res.status(200).json({ message: "Comment liked", likes: comment.likes });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const post = await Post.findById(comment.post);

    // Only comment author or post author can delete
    const isCommentAuthor = comment.author.toString() === req.user.id;
    const isPostAuthor = post.author.toString() === req.user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Remove comment from post
    post.comments.pull(comment._id);
    await post.save();

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// EDIT COMMENT
const editComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only comment author can edit
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("author", "username avatar");

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addComment,
  getComments,
  likeComment,
  deleteComment,
  editComment
};