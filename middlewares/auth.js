const jwt = require("jsonwebtoken");
const config = require("./../config/config");

const generateToken = (user) => {
  const payload = {
    _id: user._id,
  };
  const options = {
    expiresIn: "24h",
  };
  const token = jwt.sign(payload, config.jwtSecret, options);
  return token;
};

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      throw new Error("Access denied. No token provided.");
    }
    const payload = jwt.verify(token, config.jwtSecret);

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = {
  isLoggedIn,
  generateToken,
};
