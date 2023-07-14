const { User } = require('../models/user');
const { handleError } = require('../utils/handleError');

async function user(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const users = await User.create({ name, about, avatar });
    res.send(users);
  } catch (err) {
    handleError(err, req, res);
  }
}

module.exports = { createUser: user };
