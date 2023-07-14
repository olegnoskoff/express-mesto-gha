const express = require('express');

const router = express.Router();

const Card = require('../models/card');

router.get('/', (req, res, next) => {
  Card.find()
    .then((cards) => res.json(cards))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).json(card))
    .catch(next);
});

router.delete('/:cardId', (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        const error = new Error('Card not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(card);
    })
    .catch(next);
});

router.put('/:cardId/likes', (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Card not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(card);
    })
    .catch(next);
});

router.delete('/:cardId/likes', (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        const error = new Error('Card not found');
        error.name = 'NotFoundError';
        throw error;
      }
      res.json(card);
    })
    .catch(next);
});

module.exports = router;
