require('dotenv').config();
const application = require('./route/index');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors(
{
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('', application);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});