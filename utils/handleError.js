/* eslint-disable no-unused-vars */
const http = require('http');

// Вместо текстовых сообщений используем константы из пакета http
const STATUS_OK = http.STATUS_CODES[200];
const STATUS_BAD_REQUEST = http.STATUS_CODES[400];
const STATUS_NOT_FOUND = http.STATUS_CODES[404];
const STATUS_INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];

function handleError(err, req, res) {
  if (err.name === 'CastError') {
    res.status(400).send({
      message: STATUS_BAD_REQUEST,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).send({
      message: err.message,
    });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(404).send({
      message: err.message,
    });
    return;
  }

  res.status(500).send({
    message: STATUS_INTERNAL_SERVER_ERROR,
  });
}

module.exports = { handleError };
