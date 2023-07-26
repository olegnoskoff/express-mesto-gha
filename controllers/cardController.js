const http = require('http');
const { Card } = require('../models/card');

const STATUS_CREATED = http.STATUS_CODES[201];
const STATUS_BAD_REQUEST = http.STATUS_CODES[400];
const STATUS_NOT_FOUND = http.STATUS_CODES[404];
const STATUS_INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];

async function getAllCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(STATUS_CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(STATUS_BAD_REQUEST).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }
}

async function putLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }
}

async function deleteLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else {
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
