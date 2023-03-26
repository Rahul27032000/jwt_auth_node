const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/config");
const RefreshToken = require("../models/refreshToken");

const createUser = async (req, res, next) => {
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
  next();
};

const getUser = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(201).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
  next();
};

const login = async (req, res, next) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json({ message: "User Not found" });
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user.toJSON());
      const is_refreshToken = await RefreshToken.findOne({ user: user._id });

      if (!is_refreshToken) {
        const refreshToken = jwt.sign(
          user.toJSON(),
          process.env.REFRESH_TOKEN_SECRET
        );

        await RefreshToken.create({
          token: refreshToken,
          user: user._id,
        });
        console.log(1);
        return res
          .status(200)
          .json({ message: "success", accessToken, refreshToken });
      }

      const refreshToken = is_refreshToken.token;
      res.status(200).json({ message: "success", accessToken, refreshToken });
    } else {
      res.send("password is not correct");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
  next();
};

const token = async (req, res, next) => {
  const refreshToken = req.body.token;
  const is_token = await RefreshToken.findOne({ token: refreshToken });

  if (!refreshToken) return res.sendStatus(401);
  if (!is_token) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403).send(err);
    }

    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
  next();
};

const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
};

module.exports = {
  registerUser: createUser,
  getUser,
  login,
  token,
};
