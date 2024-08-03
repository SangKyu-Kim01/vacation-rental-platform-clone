const express = require("express");
const {
  getChats,
  getChat,
  addChat,
  readChat,
} = require("../controllers/chatController");
const { jwtCheck, jwtParse } = require("../middleware/auth");
const router = express.Router();

router.get("/", jwtCheck, jwtParse, getChats);
router.get("/:id", jwtCheck, jwtParse, getChat);
router.post("/", jwtCheck, jwtParse, addChat);
router.put("/read/:id", jwtCheck, jwtParse, readChat);

module.exports = router;
