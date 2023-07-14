/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Подключение к серверу MongoDB
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для обработки ошибок

app.use((err, req, res, next) => {
  console.error(err); // Вывод ошибки в консоль (можно заменить на логирование)

  let statusCode = 500;
  let message = 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({ error: message });
});

// Middleware для временной авторизации
app.use((req, res) => {
  req.user = {
    _id: '64b15f966f80a70b843f4234'
  };

  next();
});

// Роуты для пользователей
const usersRouter = require('./routes/users');

app.use('/users', usersRouter);

// Роуты для карточек
const cardsRouter = require('./routes/cards');

app.use('/cards', cardsRouter);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
