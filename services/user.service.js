const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../dev-data/data/users.json'))
);

const generateUniqueId = () => {
  return crypto.randomBytes(12).toString('hex');
};

const getAllUsers = () => {
  return users;
};

const getUserById = (id) => {
  return users.find((user) => user._id === id);
};

const createUser = (userData) => {
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

const updateUser = (id, userData) => {
  const userIndex = users.findIndex((user) => user._id === id);
  if (userIndex === -1) return null;

  users[userIndex] = { ...users[userIndex], ...userData };
  saveUsers();
  return users[userIndex];
};

const deleteUser = (id) => {
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
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
