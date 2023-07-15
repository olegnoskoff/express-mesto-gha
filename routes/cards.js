const express = require('express');
const {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cardController');

const cards = express.Router();

cards.get('/', getAllCards);
cards.post('/', createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', putLike);
cards.delete('/:cardId/likes', deleteLike);

module.exports = { cards };
