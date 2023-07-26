const express = require('express');
const {
  getAllUsers, getUser, createUser, updateUser, updateAvatar, login,
} = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

const users = express.Router();

users.get('/', getAllUsers);
users.get('/:userId', getUser);
users.post('/signup', createUser);
users.post('/signin', login);
users.patch('/me', auth, updateUser);
users.patch('/me/avatar', auth, updateAvatar);

module.exports = { users };
