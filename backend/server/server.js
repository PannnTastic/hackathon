require('dotenv').config();
const application = require('./route/index');

const express = require('express');
const path = require('path'); // Import path module
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.use('/', application);
