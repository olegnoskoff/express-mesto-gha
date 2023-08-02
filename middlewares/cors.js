/* eslint-disable consistent-return */
const allowedCors = [
  'https://mesto2023.nomoreparties.co',
  'http://mesto2023.nomoreparties.co',
  'http://localhost:3000', // Добавил протокол 'http' для localhost
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

function cors(req, res, next) {
  const { method } = req;

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    const requestHeaders = req.headers['access-control-request-headers'];
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
}

module.exports = cors;
