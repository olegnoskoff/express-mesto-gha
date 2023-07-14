/* eslint-disable no-unused-vars */
const http = require('http');
const { User } = require('../models/user');

const STATUS_OK = http.STATUS_CODES[200];
const STATUS_BAD_REQUEST = http.STATUS_CODES[400];
const STATUS_NOT_FOUND = http.STATUS_CODES[404];

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({
      message: http.STATUS_CODES[500],
    });
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: http.STATUS_CODES[500],
      });
    }
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const users = await User.create({ name, about, avatar });
    res.send(users);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: http.STATUS_CODES[500],
      });
    }
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: http.STATUS_CODES[500],
      });
    }
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(404).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
      res.status(400).send({
        message: err.message,
      });
    } else {
      res.status(500).send({
        message: http.STATUS_CODES[500],
      });
    }
  }
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
