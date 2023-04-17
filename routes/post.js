const { Router } = require("express");
const { GetPostById, GetPosts } = require("../controller/post");

const router = Router();

router.get("/", GetPosts);
router.get("/:id", GetPostById);

module.exports = router;
