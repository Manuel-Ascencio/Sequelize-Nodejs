const express = require("express");

const {
  getAllUsers,
  getUserById,
  createUser,
} = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

module.exports = { usersRouter: router };
