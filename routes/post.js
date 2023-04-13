const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.send("this is working");
});

module.exports = router;
