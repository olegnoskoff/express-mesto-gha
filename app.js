/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { handleError } = require('./utils/handleError');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;
const DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log(`Connected to database on ${DATABASE_URL}`);

    app.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

// Обработчик для несуществующих маршрутов
app.all('*', (req, res) => {
  const err = new Error('Неверный адрес запроса');
  err.name = 'NotFoundError';
  handleError(err, req, res);
});
