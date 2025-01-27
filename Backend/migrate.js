import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'Piyush@123',
  database: process.env.DB_NAME || 'Linkedin_Clone',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: process.env.DB_DIALECT || 'mysql',
});

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  storage: new SequelizeStorage({ sequelize }),
  context: sequelize.getQueryInterface(),
  logger: console,
});

(async () => {
  await umzug.up();
  console.log('Migrations have been executed successfully!');
})().catch((err) => {
  console.error('Error during migration:', err);
});
