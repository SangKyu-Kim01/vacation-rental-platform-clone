const express = require("express");
const router = express.Router();
const { addMessage } = require("../controllers/MessageController");
const { jwtCheck, jwtParse } = require("../middleware/auth");

router.post("/:chatId", jwtCheck, jwtParse, addMessage);

module.exports = router;
