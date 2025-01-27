import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './db/config.js';
import { authenticationMiddleware } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();


connectDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authenticationMiddleware);


app.get('/', (req, res)=> {
    console.log("Hello World")
});

app.listen(process.env.PORT, (req, res)=> {
    console.log(`Application run on port ${process.env.PORT}`)
});