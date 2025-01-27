import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    process.env.DB_NAME || "Linkedin_Clone",
    process.env.DB_USERNAME || "root",
    process.env.DB_PASSWORD || "Piyush@123" ,
    {
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: process.env.DB_DIALECT || 'mysql',
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

// connectDB(); 
