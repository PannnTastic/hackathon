require('dotenv').config();
const application = require('./route/index');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('', application);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});