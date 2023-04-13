const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = require("../config/config");
const RefreshToken = require("../models/refreshToken");

// register user
const register = async (req, res, next) => {
  // extract data from request
  const { password, email, username } = req.body;

  // check does user exist with given email, if it does then send an error message
  const does_user_exist_with_given_email = await User.findOne({ email: email });
  if (does_user_exist_with_given_email)
    return res.status(400).json({ message: "user exist with given email" });

  // check does user exist with given username, if it does then send an error message
  const does_user_exist_with_given_username = await User.findOne({
    username: username,
  });
  if (does_user_exist_with_given_username)
    return res.status(400).json({ message: "user exist with given username" });

  //after passing through all checks  now we can create a new user
  try {
    // hashing password
    hashedPassword = await bcrypt.hash(password, 10);

    // creating a new user with the given data
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await user.save();

    // finally send the response of new user created to api
    res.status(201).json(user);
    next();
  } catch (error) {
    // if anything goes wrong we send the error

    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// getting list of all user
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

// login route
const login = async (req, res, next) => {
  // check if user with given username exists
  let user = await User.findOne({ username: req.body.username });
  // if it doesn't exist send back error
  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }

  // now we know the user,finally we can go ahead and check the password
  try {
    // checking the password
    if (await bcrypt.compare(req.body.password, user.password)) {
      // if password is matched then create a access token that expires after 15 minutes
      const accessToken = generateAccessToken({ name: user.name });

      // check if refreshToken is already exist for the user
      const is_refreshToken = await RefreshToken.findOne({ user: user._id });

      // if does not exist then create
      if (!is_refreshToken) {
        const refreshToken = jwt.sign(
          user.toJSON(),
          process.env.REFRESH_TOKEN_SECRET
        );

        await RefreshToken.create({
          token: refreshToken,
          user: user._id,
        });

        // send the response back to the client
        return res
          .status(200)
          .json({ message: "success", accessToken, refreshToken });
      }

      // if refresh token already exists then checking that and sending it back to the client
      const refreshToken = is_refreshToken.token;
      res.status(200).json({ message: "success", accessToken, refreshToken });
      next();
    } else {
      // if password is invalid then send it error to the client
      res.status(400).send("password is not correct");
    }
  } catch (error) {
    // if anythings go wrong send error to the client
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// generating new access tokens from refresh tokens
const token = async (req, res, next) => {
  // extract refresh tokens from the request
  const refreshToken = req.body.token;
  // check that the refresh token exists

  // if refresh token is not not sent by the client send error
  if (!refreshToken)
    return res.status(401).json({ message: "Please send refresh token" });

  // check if the refresh token exists
  const is_token = await RefreshToken.findOne({ token: refreshToken });

  // check if the refresh token exists if it does not exist send back the error to the client
  if (!is_token) return res.sendStatus(403);

  // verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    // send back the error message
    if (err) {
      return res.sendStatus(403).send(err);
    }
    // finally create new access token and send response to client
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
    next();
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

module.exports = {
  register,
  getUser,
  login,
  token,
};
