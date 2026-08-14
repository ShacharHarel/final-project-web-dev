const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const watchHistoryRoutes = require('./routes/watchHistoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { requirePageAuth } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/contents', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contents', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contents.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/feed', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'feed.html'));
});

app.get('/profiles', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profiles.html'));
});

app.get('/watch-history', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'watch-history.html'));
});

app.get('/reviews', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reviews.html'));
});

app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await connectDatabase();
});
