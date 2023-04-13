const express = require("express");
const { getUser, login, token, register } = require("../controller/auth");
const router = express.Router();

router.get("", getUser);

router.post("/register", register);
router.post("/login", login);
router.post("/token", token);

module.exports = router;
