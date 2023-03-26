require("dotenv").config();
const mongoose = require("mongoose");

const SERVER_PORT = process.env.PORT || 4000;
const MONGO_USERNAME = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASS;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.zxum6mo.mongodb.net/?retryWrites=true&w=majority`;

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("databse connected");
  } catch (e) {
    console.log(e);
  }
};
module.exports = {
  port: SERVER_PORT,
  db: connectDb,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
