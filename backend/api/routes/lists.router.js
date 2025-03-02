const express = require("express");
const router = express.Router();
const listsController = require("../controllers/lists.controller");
const verifyToken = require("../middleware/jwt");

// all list interactions needs to be verified by a JWT
router.get("/", verifyToken, listsController.getAllLists);
router.get("/:listName", verifyToken, listsController.getList); // get list
router.post("/:listName", verifyToken, listsController.createNewList); // create new list
router.delete("/:listName", verifyToken, listsController.deleteList); // delete an existing list
router.post("/:listName/:itemName", verifyToken, listsController.addItemToList); // add item to a list
router.delete("/:listName/:itemName", verifyToken, listsController.removeItemFromList); // delete item from a list

module.exports = router;
