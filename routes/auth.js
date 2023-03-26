const express = require("express");
const { registerUser, getUser, login, token } = require("../controller/auth");
const router = express.Router();

router.get("", getUser);

router.post("/register", registerUser);
router.post("/login", login);
router.post("/token", token);

module.exports = router;
