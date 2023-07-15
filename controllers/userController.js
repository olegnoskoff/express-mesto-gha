const http = require('http');
const { User } = require('../models/user');

const STATUS_CREATED = http.STATUS_CODES[201];
const STATUS_BAD_REQUEST = http.STATUS_CODES[400];
const STATUS_NOT_FOUND = http.STATUS_CODES[404];
const STATUS_INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];

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
      res.status(404).send({
        message: 'Пользователь не найден',
      });
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(500).send({
      message: http.STATUS_CODES[500],
    });
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;

    if (name.length < 2) {
      res.status(400).send({
        message: 'Некорректное имя пользователя',
      });
      return;
    }

    const user = await User.create({ name, about, avatar });
    res.status(STATUS_CREATED).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(STATUS_BAD_REQUEST).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: http.STATUS_CODES[500],
      });
    }
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    if (name && name.length < 2) {
      res.status(400).send({
        message: 'Некорректное имя пользователя',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
      res.status(STATUS_BAD_REQUEST).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
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
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
      res.status(STATUS_BAD_REQUEST).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
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
