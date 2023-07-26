const http = require('http');

const STATUS_BAD_REQUEST = 400;
const STATUS_NOT_FOUND = 404;
const STATUS_INTERNAL_SERVER_ERROR = 500;

function handleError(err, req, res) {
  if (err.name === 'CastError') {
    res.status(STATUS_BAD_REQUEST).send({
      message: http.STATUS_CODES[STATUS_BAD_REQUEST],
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(STATUS_BAD_REQUEST).send({
      message: err.message,
    });
    return;
  }

  if (err.name === 'NotFoundError') {
    res.status(STATUS_NOT_FOUND).send({
      message: err.message,
    });
    return;
  }

  res.status(STATUS_INTERNAL_SERVER_ERROR).send({
    message: http.STATUS_CODES[STATUS_INTERNAL_SERVER_ERROR],
  });
}

module.exports = { handleError };
