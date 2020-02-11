const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authen = require("../../middleware/authen");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

//@route  Add Comment api/post/
//@desc   Add Comment
//@access private

router.post(
  "/",
  [
    authen,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        avatar: user.avatar
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(400).send("Server Error");
    }
  }
);

//@route  Get Posts api/post/
//@desc   Get All Posts
//@access private

router.get("/", authen, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route  Get api/post/:id
//@desc   Get specific post
//@access private
router.get("/:id", authen, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ msg: "Post was not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      res.status(404).json({ msg: "Post was not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  Delete api/post/:id
//@desc   Delete specific post
//@access private

router.delete("/:id", authen, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ msg: "Post was not found" });
    }
    if (post.user.toString() !== req.user.id) {
      res.status(400).json({ msg: "Unauthorized access" });
    }
    await post.remove();
    res.json("Comment has been removed");
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      res.status(400).json({ msg: "Post was not found" });
    }
    return res.status(500).send("Server Error");
  }
});

//@route  Post api/post/comment/:id
//@desc   Comment on post
//@access private
router.post(
  "/comment/:id",
  [
    authen,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const post = await Post.findById(req.params.id);
      const user = await User.findById(req.user.id).select("-password");

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        avatar: user.avatar
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (error) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//@route  Delete api/post/:comment_id/:id
//@desc   Delete a comment
//@access private

router.delete("/comment/:comment_id/:id", authen, async (req, res) => {
  try {
    const post = await Post.findById(req.params.comment_id);

    //To get the comments from the post
    const comment = post.comments.find(
      (comment) => comment.id === req.params.id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment was not found" });
    }

    //check authorization of the person deleting the user

    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Unauthorized access" });
    }

    const removeIndex = post.comments
      .filter((comment) => comment.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//@route  Put /post/like/:id
//@desc   Like a comment
//@access private

router.put("/like/:id", authen, async (req, res) => {
  try {
    //get post & user
    const post = await Post.findById(req.params.id);
    //check to see if post has already been liked by current user
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post has already been liked" });
    }

    //like the post
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

//@route  Put /post/unlike/:id
//@desc   Unlike a comment
//@access private

router.put("/unlike/:id", authen, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (
      post.likes.filter((unlike) => unlike.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json("Messege was not liked");
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
