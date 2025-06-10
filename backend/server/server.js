require('dotenv').config();

const express = require('express');
const cors = require('cors');
const application = require('./route/index');

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['https://l8nr35pw-5173.asse.devtunnels.ms'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', application);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
