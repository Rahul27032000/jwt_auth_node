const express = require("express");
const { port, db } = require("./config/config");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const authentication = require("./middleware/auth");
const app = express();
db();

app.use(express.json());

app.use("", authRouter);
app.use("/post", authentication, postRouter);

app.listen(port, console.log(port));
