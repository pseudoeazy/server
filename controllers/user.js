const bcrypt = require("bcrypt");
const User = require("../models/schemas/user");
const { registerValidation } = require("../helpers/validation");
const { getErrorMessage } = require("../helpers/dbErrorHandler");

/**
 * register new user.
 */
const register = async (req, res) => {
  //validate data before registering a new user
  const { error } = registerValidation(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });

  // check if the user is already registered in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(400)
      .json({ success: false, message: "Email already exist" });

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  // convert the email to lowercase and create a new user
  const user = new User({
    fullName: `${req.body.firstName} ${req.body.lastName}`,
    email: req.body.email.toLowerCase(),
    password,
  });

  try {
    const savedUser = await user.save();
    res.json({
      success: true,
      user: savedUser,
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(err),
    });
  }
};

/**
 * Load all users.
 */
const listUsers = async (req, res) => {
  console.log("listUsers req =>");
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "something went wrong", error });
  }
};

/**
 * get user by id
 */
const userByID = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId).exec();
    if (!user)
      return res.status("400").json({
        sucess: false,
        error: "User not found",
      });
    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

/**
 * update user profile
 */
const updateUser = async (req, res) => {
  try {
    const profile = await User.updateOne(
      { _id: req.params.userId },
      { $set: req.body }
    );
    return res.status(200).json({ success: true, user: profile });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err,
    });
  }
};

/**
 * delete user profile
 */
const removeUser = async (req, res) => {
  try {
    const deletedUser = await User.deleteOne({
      _id: req.params.userId,
    });
    return res.status(200).json({ success: true, user: deletedUser });
  } catch (err) {
    return res.status(400).json({
      message: "something went wrong",
      err,
    });
  }
};

module.exports = {
  register,
  listUsers,
  userByID,
  updateUser,
  removeUser,
};
