const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.get('/', (req, res, next) => {
  User.find()
    .then((users) => res.json(users))
    .catch(next);
});

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(user);
    })
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).json(user))
    .catch(next);
});

router.patch('/me', (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(user);
    })
    .catch(next);
});

router.patch('/me/avatar', (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        const error = new Error('User not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(user);
    })
    .catch(next);
});

module.exports = router;
