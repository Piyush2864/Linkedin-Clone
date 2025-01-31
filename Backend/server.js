const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./db/config.js');
const authRoute = require('./routes/authRoute.js');
const profileRoute = require('./routes/profileRoute.js');

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/profile', profileRoute);

app.get('/', (req, res) => {
    console.log("Hello World");
});

app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${process.env.PORT}`);
});
