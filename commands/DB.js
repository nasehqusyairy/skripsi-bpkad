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

const ScaffoldingDB = createPool({
  host: process.env.SCAFFOLDING_SOURCE_HOST || host,
  user: process.env.SCAFFOLDING_SOURCE_USER || user,
  password: process.env.SCAFFOLDING_SOURCE_PASSWORD || password,
  database: process.env.SCAFFOLDING_SOURCE_NAME || database,
});

module.exports = { DB, ScaffoldingDB };