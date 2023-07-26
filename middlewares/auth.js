const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  jwt.verify(token, '64b15f966f80a70b843f4234', (err, payload) => {
    if (err) {
      res.status(401).send({ message: 'Необходима авторизация' });
      return;
    }

    req.user = payload;
    next();
  });
}

module.exports = { auth };
