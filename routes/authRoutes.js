// Routes של אימות: מחברים כתובות API לפונקציות הרשמה, התחברות, התנתקות ומשתמש נוכחי.
const express = require('express');
const {
    register,
    login,
    logout,
    getCurrentUser
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// נתיבים ציבוריים ליצירת משתמש ולהתחברות.
router.post('/register', register);
router.post('/login', login);
// נתיבים אלה דורשים Session פעיל.
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getCurrentUser);

module.exports = router;
