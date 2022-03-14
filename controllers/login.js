const bcrypt = require("bcrypt");
const { getUser } = require("../models/db/user");
const { loginValidation } = require("../helpers/validation");
const { getErrorMessage } = require("../helpers/dbErrorHandler");
const { generateToken } = require("../middlewares/auth");

const login = async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // check if the user is registered in the database
    const user = await getUser({ email: req.body.email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // check if the password is valid
    const isValid = await bcrypt.compare(req.body.password, user.password);

    if (!isValid) {
      throw new Error("Invalid Email or Password");
    }

    //sign in the user
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: getErrorMessage(error) ?? error?.message,
    });
  }
};

module.exports = login;
