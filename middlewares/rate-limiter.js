const rateLimit = require('express-rate-limit');

// Ограничение количества запросов к серверу в единицу времени
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // За 15 минут
  max: 100, // Максимум 100 запросов с одного IP
});

module.exports = limiter;
