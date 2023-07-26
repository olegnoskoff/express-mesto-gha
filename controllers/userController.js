const http = require('http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const STATUS_OK = http.STATUS_CODES[200];
const STATUS_CREATED = http.STATUS_CODES[201];
const STATUS_BAD_REQUEST = http.STATUS_CODES[400];
const STATUS_NOT_FOUND = http.STATUS_CODES[404];
const STATUS_INTERNAL_SERVER_ERROR = http.STATUS_CODES[500];

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(STATUS_NOT_FOUND).send({
        message: 'Пользователь не найден',
      });
    } else {
      res.status(STATUS_OK).send(user);
    }
  } catch (err) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

async function createUser(req, res) {
  try {
    const {
      name = 'Жак-Ив Кусто', about = 'Исследователь', avatar = 'https://link-to-default-avatar.com', email, password,
    } = req.body;

    // Проверка наличия данных в запросе
    if (!email || !password) {
      res.status(STATUS_BAD_REQUEST).send({
        message: 'Отсутствуют необходимые данные для регистрации пользователя.',
      });
      return;
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });

    // Убираем поле с хешем пароля из ответа
    user.password = undefined;

    // Возвращаем созданного пользователя в ответе
    res.status(STATUS_CREATED).send(user);
  } catch (err) {
    // Проверка и обработка ошибок валидации
    if (err.name === 'ValidationError') {
      res.status(STATUS_BAD_REQUEST).send({
        message: err.message,
      });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      res.status(STATUS_BAD_REQUEST).send({
        message: 'Пользователь с таким email уже зарегистрирован.',
      });
    } else {
      // Обработка других ошибок
      res.status(STATUS_INTERNAL_SERVER_ERROR).send({
        message: STATUS_INTERNAL_SERVER_ERROR,
      });
    }
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(STATUS_BAD_REQUEST).send({
        message: 'Неправильные почта или пароль',
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(STATUS_BAD_REQUEST).send({
        message: 'Неправильные почта или пароль',
      });
      return;
    }

    const secretKey = '64b15f966f80a70b843f4234';
    const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });

    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });

    res.send({ message: 'Авторизация прошла успешно' });
  } catch (err) {
    res.status(STATUS_INTERNAL_SERVER_ERROR).send({
      message: STATUS_INTERNAL_SERVER_ERROR,
    });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;

    if (name && name.length < 2) {
      res.status(STATUS_BAD_REQUEST).send({
        message: 'Некорректное имя пользователя',
      });
      return;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
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

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFoundError') {
      res.status(STATUS_NOT_FOUND).send({
        message: err.message,
      });
    } else if (err.name === 'ValidationError') {
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

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
