const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Routes for API endpoints controlling users
router.get("/", userController.getUsers);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;