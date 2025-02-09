const { createPool } = require('mysql2/promise');

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

const DB = createPool({
  host,
  user,
  password,
  database,
});

module.exports = { DB };