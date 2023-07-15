const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');
const { handleError } = require('./utils/handleError');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

// Подключение к базе данных
mongoose.connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`);

    // Запуск сервера после установления соединения с базой данных
    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64b15f966f80a70b843f4234',
  };
  next();
});

app.use(routes);

// Обработчик для несуществующих маршрутов
app.all('*', (req, res) => {
  const err = new Error('Неверный адрес запроса');
  err.name = 'NotFoundError';
  handleError(err, req, res);
});

module.exports = app;
