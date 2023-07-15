const express = require('express');
const {
  getAllUsers, getUser, createUser, updateUser, updateAvatar,
} = require('../controllers/userController');

const users = express.Router();

users.get('/', getAllUsers);
users.get('/:userId', getUser);
users.post('/', createUser);
users.patch('/me', updateUser);
users.patch('/me/avatar', updateAvatar);

module.exports = { users };
