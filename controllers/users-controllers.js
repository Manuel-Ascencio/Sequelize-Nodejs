const { User } = require("../models/user-model");
const { Comment } = require("../models/comment-model");
const { Post } = require("../models/post-model");

const { filterObj } = require("../util/filterObj");
const { catchAsync } = require("../util/catchAsync");
const { AppError } = require("../util/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: "active" },
    include: [
      {
        model: Post,
        include: [{ model: Comment, include: [{ model: User }] }],
      },
      { model: Comment, include: [{ model: Post }] },
    ],
  });
  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });

  if (!user) {
    return next(new AppError(404, "user not founts"));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new AppError(400, "Must provide a valid name, email and password")
    );
  }

  const newUser = await User.create({ name, email, password });

  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});
