const express = require("express");
const { port, db } = require("./config/config");
const authRouter = require("./routes/auth");
const app = express();
db();

app.use(express.json());

app.use("", authRouter);

app.listen(port, console.log(port));
