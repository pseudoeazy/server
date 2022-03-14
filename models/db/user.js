const User = require("../schemas/user");

const createUser = async (user) => {
  const { firstName, lastName, email, password } = user;

  // convert the email to lowercase and create a new user
  const savedUser = new User({
    fullName: `${firstName} ${lastName}`,
    email: email.toLowerCase(),
    password,
  });

  return await savedUser.save();
};

const getUsers = async () => {
  const users = await User.find();

  return await users;
};

const getUser = async (data) => {
  const user = await User.findOne(data);

  return await user;
};

const getUserById = async (userId) => {
  const users = await User.findById(userId).exec();

  return await users;
};

const setUser = async (userId, userData) => {
  const user = await User.updateOne({ _id: userId }, { $set: userData });

  return await user;
};

const deleteUser = async (userId) => {
  const user = await User.deleteOne({
    _id: userId,
  });

  return await user;
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  getUserById,
  setUser,
  deleteUser,
};
