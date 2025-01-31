'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



// import fs from 'fs';
// import path from 'path';
// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config(); // Load environment variables from .env file

// const basename = path.basename(import.meta.url);
// const env = process.env.NODE_ENV || 'development';
// // import config from '../config/config' assert { type: 'json' }; // Import config.json
// import config from '../config/config.js'; // Import the JS config file

// const db = {};

// let sequelize;
// const currentConfig = config[env];

// if (currentConfig.use_env_variable) {
//   sequelize = new Sequelize(process.env[currentConfig.use_env_variable], currentConfig);
// } else {
//   sequelize = new Sequelize(currentConfig.database, currentConfig.username, currentConfig.password, currentConfig);
// }

// fs.readdirSync(__dirname)
//   .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1)
//   .forEach(file => {
//     import(path.join(__dirname, file))
//       .then(module => {
//         const model = module(sequelize, Sequelize.DataTypes);
//         db[model.name] = model;
//       })
//       .catch(err => console.error(`Failed to load model ${file}: ${err.message}`));
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// export default db;
