const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await connectDatabase();
});

