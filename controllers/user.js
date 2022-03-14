const bcrypt = require("bcrypt");
const { registerValidation } = require("../helpers/validation");
const { getErrorMessage } = require("../helpers/dbErrorHandler");
const {
  createUser,
  getUsers,
  getUser,
  getUserById,
  setUser,
  deleteUser,
} = require("../models/db/user");

/**
 * register new user.
 */

const registerUser = async (req, res) => {
  try {
    //validate data before registering a new user
    const { error } = registerValidation(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // check if the user is already registered in the database
    const emailExist = await getUser({ email: req.body.email });
    if (emailExist) {
      throw new Error("Email already exist");
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = await createUser(req.body);

    return res.status(201).json({
      success: true,
      user,
      message: "Successfully signed up!",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

/**
 * Load all users.
 */
const listUsers = async (req, res) => {
  try {
    const users = await getUsers();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

/**
 * get user by id
 */
const userByID = async (req, res) => {
  try {
    const user = await getUserById(req.params.userId);
    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

/**
 * update user profile
 */
const updateUser = async (req, res) => {
  try {
    const user = await setUser(req.params.userId, req.body);
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

/**
 * delete user profile
 */
const removeUser = async (req, res) => {
  try {
    const user = await deleteUser(req.params.userId);
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

module.exports = {
  registerUser,
  listUsers,
  userByID,
  updateUser,
  removeUser,
};
