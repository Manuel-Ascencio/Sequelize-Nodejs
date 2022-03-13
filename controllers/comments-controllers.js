const { Comment } = require("../models/comment-model");
const { User } = require("../models/user-model");

const { filterObj } = require("../util/filterObj");

const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.getAllComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.findAll({
    where: { status: "active" },
    include: [{ model: User }],
  });
  res.status(200).json({
    status: "success",
    data: {
      comments,
    },
  });
});

exports.getCommentById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findOne({ where: { id, status: "active" } });

  if (!comment) {
    return next(new AppError(404, "comment not found"));
  }

  res.status(200).json({
    status: "success",
    data: { comment },
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { text, postId, userId } = req.body;

  if (!text || !postId || !userId) {
    return next(
      new AppError(400, "Must provide a valid text, userId and postId")
    );
  }

  const newComment = await Comment.create({ text, postId, userId });

  res.status(201).json({
    status: "success",
    data: { newComment },
  });
});
