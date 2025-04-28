require('dotenv').config();
const application = require('./route/index');

const express = require('express');
const path = require('path'); // Import path module
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('', application);
