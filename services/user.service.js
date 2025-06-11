const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const User = require('../models/user.model');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dev-data/data/users.json'))
);

const generateUniqueId = () => {
  return crypto.randomBytes(12).toString('hex');
};

// MongoDB Functions
const getAllUsersMongo = async () => {
  return await User.find();
};

const getUserByIdMongo = async (id) => {
  return await User.findById(id);
};

const createUserMongo = async (userData) => {
  return await User.create(userData);
};

const updateUserMongo = async (id, userData) => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

const deleteUserMongo = async (id) => {
  return await User.findByIdAndDelete(id);
};

// JSON File Functions
const getAllUsersJSON = () => {
  return users;
};

const getUserByIdJSON = (id) => {
  return users.find((user) => user._id === id);
};

const createUserJSON = (userData) => {
  const newUser = {
    _id: generateUniqueId(),
    ...userData,
  };

  const filePath = path.join(__dirname, '../dev-data/data/users.json');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  let newContent = fileContent.slice(0, -1);
  if (newContent.length > 1) {
    newContent += ',';
  }

  newContent += `\n  ${JSON.stringify(newUser)}\n]`;

  fs.writeFileSync(filePath, newContent);

  users.push(newUser);

  return newUser;
};

const updateUserJSON = (id, userData) => {
  const userIndex = users.findIndex((user) => user._id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...userData };
  saveUsers();
  return users[userIndex];
};

const deleteUserJSON = (id) => {
  const userIndex = users.findIndex((user) => user._id === id);
  if (userIndex === -1) return null;

  const deletedUser = users.splice(userIndex, 1)[0];
  saveUsers();
  return deletedUser;
};

const saveUsers = () => {
  fs.writeFileSync(
    path.join(__dirname, '../dev-data/data/users.json'),
    JSON.stringify(users, null, 2)
  );
};

module.exports = {
  getAllUsers:
    process.env.USE_MONGO === 'true' ? getAllUsersMongo : getAllUsersJSON,
  getUserById:
    process.env.USE_MONGO === 'true' ? getUserByIdMongo : getUserByIdJSON,
  createUser:
    process.env.USE_MONGO === 'true' ? createUserMongo : createUserJSON,
  updateUser:
    process.env.USE_MONGO === 'true' ? updateUserMongo : updateUserJSON,
  deleteUser:
    process.env.USE_MONGO === 'true' ? deleteUserMongo : deleteUserJSON,
};
