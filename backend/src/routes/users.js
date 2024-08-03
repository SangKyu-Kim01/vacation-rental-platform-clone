const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/UsersController");
const { jwtCheck, jwtParse } = require("../middleware/auth");

require("dotenv").config();

/* GET ALL USERS */
router.get("/", jwtCheck, jwtParse, UsersController.getAllUsers);

/* GET USER BY ID*/
router.get("/:id", jwtCheck, jwtParse, UsersController.getUserById);

/* DELETE USER BY ID */
router.delete("/:id", jwtCheck, jwtParse, UsersController.deleteUser);

/* UPDATE USER BY ID */
router.put("/:id", jwtCheck, jwtParse, UsersController.updateUser);

module.exports = router;
