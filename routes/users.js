const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const { getUser } = require('../controllers/userController');
const { createUser } = require('../controllers/userController');
const { updateUser } = require('../controllers/userController');
const { updateAvatar } = require('../controllers/userController');

const users = express.Router();

users.get('/', getAllUsers);
users.get('/:userId', getUser);
users.post('/', express.json(), createUser);
users.patch('/me', express.json(), updateUser);
users.patch('/me/avatar', express.json(), updateAvatar);

module.exports = { users };
