const allowedCors = [
  'https://movies.ogarkov.com',
  'http://movies.ogarkov.com',
  'http://localhost:3002',
  'localhost:3002',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const DEFAULT_ALLOWED_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

module.exports = {
  allowedCors, DEFAULT_ALLOWED_METHODS, DEFAULT_ALLOWED_HEADERS,
};
