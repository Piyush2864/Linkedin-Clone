import express from 'express';
import dotenv from 'dotenv';

dotenv.config();


const app = express();


app.get('/', (req, res)=> {
    console.log("Hello World")
});

app.listen(process.env.PORT, (req, res)=> {
    console.log(`Application run on port ${process.env.PORT}`)
});