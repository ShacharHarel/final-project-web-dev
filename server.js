// קובץ הכניסה הראשי: יוצר את שרת Express, מחבר Middleware ו-Routes ומגיש את מסכי ה-HTML.
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
const userRoutes = require('./routes/userRoutes');
const feedRoutes = require('./routes/feedRoutes');
const externalRoutes = require('./routes/externalRoutes');
const { requirePageAuth, requirePageAdmin } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware בסיסי קורא JSON וטפסים שנשלחים מהדפדפן.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Session שומר את זהות המשתמש בצד השרת למשך 24 שעות.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
// קבצי CSS, JavaScript ותמונות נגישים ישירות מתוך public.
app.use(express.static(path.join(__dirname, 'public')));

// פונקציית Logging פשוטה מדפיסה למסוף זמן, סוג בקשה וכתובת.
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});
// חיבור כל קבוצת Routes לכתובת הבסיס המתאימה ב-API.
app.use('/api/contents', contentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/watch-history', watchHistoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/external', externalRoutes);

// מציג את דף הנחיתה הציבורי.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// מציג את קטלוג התכנים; פעולות שינוי בתוכו עדיין מוגנות ב-API.
app.get('/contents', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contents.html'));
});

// מציג את טופס ההרשמה.
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

// מציג את טופס ההתחברות.
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// מציג בחירת פרופיל רק לאחר התחברות.
app.get('/choose-profile', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'choose-profile.html'));
});

// מציג את הפיד האישי למשתמש מחובר.
app.get('/feed', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'feed.html'));
});

// מציג את מסך ניהול הפרופילים למשתמש מחובר.
app.get('/profiles', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'profiles.html'));
});

// מציג את מסך היסטוריית הצפייה למשתמש מחובר.
app.get('/watch-history', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'watch-history.html'));
});

// מציג את מסך הביקורות למשתמש מחובר.
app.get('/reviews', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reviews.html'));
});

// מציג חיפוש מתקדם, נתונים מסכמים וגרפי D3.
app.get('/explore', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'explore.html'));
});

// מציג את המפה ואת החיפוש בשירות TVmaze.
app.get('/services', requirePageAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'services.html'));
});

// מציג ניהול משתמשים רק למנהל.
app.get('/users', requirePageAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'users.html'));
});

// מפעיל את השרת ורק לאחר מכן מנסה לפתוח את החיבור ל-MongoDB.
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    await connectDatabase();
});
