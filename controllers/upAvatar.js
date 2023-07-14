const { User } = require('../models/user');
const { handleError } = require('../utils/handleError');

async function upAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );
    res.send(user);
  } catch (err) {
    handleError(err, req, res);
  }
}

module.exports = { updateAvatar: upAvatar };
