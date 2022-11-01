require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');

const {
  PORT = 3000, NODE_ENV, BASE_PATH, DB_NAME,
} = process.env;
const app = express();

const routes = require('./routes/index');
const err = require('./middlewares/err');
const limiter = require('./middlewares/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS } = require('./constants/cors');

// Логирование запросов к серверу
app.use(requestLogger);

// Защита от брутфорса/DDоS'а
app.use(limiter);

// Подключаемся к серверу MongoDB
mongoose.connect(NODE_ENV === 'production' ? DB_NAME : 'mongodb://localhost:27017/moviesdb', {
  autoIndex: true, // Без этого не будет работать unique: true
});

// Поддержка CORS
app.use((req, res, next) => {
  const { method } = req; // Сохраняем тип запроса (HTTP-метод)
  const { origin } = req.headers; // Сохраняем источник запроса
  // Проверяем, есть ли источник запроса среди разрешенных
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', '*');
  }
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // Разрешаем кросс-доменные запросы перечисленных типов
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', DEFAULT_ALLOWED_HEADERS);
    return res.end();
  }
  next();
  return null;
});

// Простановка заголовков безопасности
app.use(helmet());

// Для разбора JSON
app.use(bodyParser.json());

// Роутинг (вынесен отдельно)
app.use(routes);

// Логирование ошибок
app.use(errorLogger);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованная обработка ошибок
app.use(err);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
