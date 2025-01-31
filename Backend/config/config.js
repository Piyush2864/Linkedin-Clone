const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Piyush@123",
    database: process.env.DB_NAME || "Linkedin_Clone",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    migrationStorageTableName: 'SequelizeMeta',
    migrations: {
      path: "P:/Linkedin_Clone/Linkedin-Clone/Backend/migrations" // Ensure this path is correct
    },
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Piyush@123",
    database: process.env.DB_NAME_TEST || "Linkedin_Clone_Test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    migrationStorageTableName: 'SequelizeMeta',
    migrations: {
      path: "P:/Linkedin_Clone/Linkedin-Clone/Backend/migrations" // Ensure this path is correct
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    migrationStorageTableName: 'SequelizeMeta',
    migrations: {
      path: "P:/Linkedin_Clone/Linkedin-Clone/Backend/migrations" // Ensure this path is correct
    },
  }
};
