const express = require("express");
const router = express.Router();
const MyUserController = require("../controllers/MyUserController");
const { jwtCheck, jwtParse } = require("../middleware/auth");
const { validateMyUserRequest } = require("../middleware/validation");

require("dotenv").config();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", jwtCheck, MyUserController.createUser);

router.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("image"),
  MyUserController.updateUser
);

router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser);

module.exports = router;
