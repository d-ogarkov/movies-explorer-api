const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const err = require('./middlewares/err');

// Подключаемся к серверу MongoDB
mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  autoIndex: true, // Без этого не будет работать unique: true
});

// Для разбора JSON
app.use(bodyParser.json());

// Логирование запросов к серверу
app.use(requestLogger);

// Роутинг (вынесен отдельно)
app.use(routes);

// Логирование ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(err);

console.log('-------------------------------------------------');
app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
