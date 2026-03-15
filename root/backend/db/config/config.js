require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_BASE,
    "options": {
      "host": process.env.DB_HOST,
      "port":process.env.DB_PORT,
      "dialect": process.env.DB_DIALECT,
      "dialectOptions": {
        "client_encoding": process.env.DB_CLIENT_ENCODING,
      }
    }
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_BASE,
    "options": {
      "host": process.env.DB_HOST,
      "port":process.env.DB_PORT,
      "dialect": process.env.DB_DIALECT,
      "dialectOptions": {
        "client_encoding": process.env.DB_CLIENT_ENCODING,
      }
    }
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_BASE,
    "options": {
      "host": process.env.DB_HOST,
      "port":process.env.DB_PORT,
      "dialect": process.env.DB_DIALECT,
      "dialectOptions": {
        "client_encoding": process.env.DB_CLIENT_ENCODING,
      }
    }
  }
}
