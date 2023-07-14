const express = require('express');
const { getAllCards } = require('../controllers/cardController');
const { createCard } = require('../controllers/cardController');
const { deleteCard } = require('../controllers/cardController');
const { putLike } = require('../controllers/cardController');
const { deleteLike } = require('../controllers/cardController');

const cards = express.Router();

cards.get('/', getAllCards);
cards.post('/', express.json(), createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', putLike);
cards.delete('/:cardId/likes', deleteLike);

module.exports = { cards };
