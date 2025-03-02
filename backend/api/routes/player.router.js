const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player.controller");
const verifyToken = require("../middleware/jwt");

// Routes for API endpoints controlling users
router.get("/", playerController.getAllPlayers);
router.get("/:userId", verifyToken, playerController.getPlayerById);
router.post("/:userName", playerController.addPlayer);
router.delete("/:userId", playerController.removePlayer);

module.exports = router;
