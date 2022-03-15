const express = require("express");

const { globalErrorHandler } = require("./controllers/error-controller");

const { postsRouter } = require("./routes/posts-routes");
const { usersRouter } = require("./routes/users-routes");
const { commentsRouter } = require("./routes/comment-routes");

const { AppError } = require("./util/appError");

const app = express();

app.use(express.json());

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/comments", commentsRouter);

app.use("*", (req, res, next) => {
  next(new AppError(404, `${req.originalUrl} not found in this server.`));
});

app.use(globalErrorHandler);

module.exports = { app };
