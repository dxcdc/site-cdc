'use strict';

require('dotenv').config();

const config = {
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || 'postgres',
  logging: false,
};

module.exports = {
  development: config,
  test: config,
  production: config,
};
