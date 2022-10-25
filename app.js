const express = require('express');
const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH}`);
  console.log(`Слушаем порт ${PORT}`);
});
