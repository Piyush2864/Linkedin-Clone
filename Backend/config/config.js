import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Piyush@123",
    database: process.env.DB_NAME || "Linkedin_Clone",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql"
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "Piyush@123",
    database: process.env.DB_NAME_TEST || "Linkedin_Clone_Test",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql"
  }
};
