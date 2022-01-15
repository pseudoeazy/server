const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("./../config/config");
const User = require("../models/schemas/user");

const { loginValidation } = require("../helpers/validation");
const { getErrorMessage } = require("../helpers/dbErrorHandler");

function createToken(user) {
  const payload = {
    user_id: user._id,
    name: user.firstName,
    email: user.email,
    seller: user.seller,
  };
  const options = {
    expiresIn: "24h",
  };
  const token = jwt.sign(payload, config.jwtSecret, options);
  return token;
}

const login = async (req, res) => {
  try {
    console.log("Attempting to login =>", req.body);

    const { error } = loginValidation(req.body);
    if (error) {
      return res
        .status(400)
        .send({ success: false, error: error.details[0].message });
    }

    // check if the user is registered in the database
    const user = await User.findOne({ email: req.body.email });
    console.log("UserIs: ", user);

    if (!user)
      return res
        .status(400)
        .json({ success: false, error: "Invalid Credentials" });

    // check if the password is valid
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Email or Password" });
    }
    console.log("passwordIsValid: ", validPassword);

    //sign in the user
    const token = createToken(user);
    res.cookie("token", token, {
      expire: new Date() + 9999,
    });

    //store token in DB
    const profile = await User.updateOne(
      { _id: user._id },
      { $set: { token } }
    );
    console.log("LoggedInUser => ", { profile });

    return res.header("auth", token).json({
      success: true,
      token,
      user: {
        user_id: user._id,
        name: user.firstName,
        email: user.email,
        seller: user.seller,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(err),
    });
  }
};

const signout = async (req, res) => {
  console.log("req body =>", req.body);
  res.clearCookie("token");
  const profile = await User.updateOne(
    { _id: req.body.user_id },
    { $set: { token: null } }
  );
  console.log("LoggedOutUser => ", { profile });
  return res.json({ message: "Signout success!", success: true });
};

const isLoggedIn = async (userId, token) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return false;
    const validToken = token === user.token;
    console.log(
      "isValidLoginToken =>",
      validToken,
      "user =>",
      user,
      "token =>",
      token,
      "userToken =>",
      user.token
    );
    if (!validToken) {
      return false;
    }

    return {
      user_id: user._id,
      name: user.firstName,
      email: user.email,
      seller: user.seller,
    };
  } catch (err) {
    return false;
  }
};
const hasAuthorization = (req, res, next) => {
  const authorized = req.profile.user_id == req.auth.user_id;
  if (!authorized) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};
const authenticate = async (req, res, next) => {
  const token = req.header("auth");
  console.log("token =>", token);
  if (!token)
    return res
      .status(401)
      .json({ success: false, error: "User is not logged in" });
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    console.log("payload =>", payload);
    const isValidLoginToken = await isLoggedIn(payload.user_id, token);

    if (!isValidLoginToken) {
      return res.status(401).json({
        success: false,
        error: "User is not logged in / expired session",
      });
    }
    req.profile = isValidLoginToken;
    req.auth = payload;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token", err });
  }
};

module.exports = {
  login,
  authenticate,
  signout,
  hasAuthorization,
};
