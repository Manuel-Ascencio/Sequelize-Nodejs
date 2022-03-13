const { Post } = require("../models/post-model");

const { filterObj } = require("../util/filterObj");

const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({ where: { status: "active " } });

  res.status(200).json({
    status: "success",
    data: {
      posts,
    },
  });
});

exports.getPostById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOne({ where: { id, status: "active" } });

  if (!post) {
    return next(new AppError(404, "No post found with the given ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return next(
      new AppError(400, "Must provide a valid title, conten and userId")
    );
  }

  const newPost = await Post.create({ title, content, userId });

  res.status(202).json({
    status: "success",
    data: {
      newPost,
    },
  });
});

exports.updatePostPut = async (req, res) => {
  const { id } = req.params;
  const { title, content, userId } = req.body;

  if (
    !title ||
    !content ||
    !userId ||
    title.length === 0 ||
    content.length === 0 ||
    userId.length === 0
  ) {
    res.status(404).json({
      status: "error",
      message: "Must provide a title, content and the author for this request",
    });
    return;
  }
  const post = await Post.findOne({ where: { id, status: "active" } });

  await post.update({ title, content, userId });

  res.status(204).json({ status: "success" });
};

exports.updatePostPatch = async (req, res) => {
  const { id } = req.params;
  const data = filterObj(req.body, "title", "content", "userId");

  const post = await Post.findOne({ where: { id, status: "active" } });

  await post.update({ ...data });

  res.status(204).json({ status: "success " });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const post = Post.findOne({ where: { id, status: "active" } });

  await post.update({ status: "deleted" });

  res.status(204).json({ status: "success" });
};
