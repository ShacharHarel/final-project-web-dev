// Routes של ניהול משתמשים: רשימה, חיפוש, שינוי תפקיד ומחיקה למנהל בלבד.
const express = require('express');
const {
    getAllUsers,
    searchUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Middleware מרכזי מגן על כל הנתיבים בקובץ בהרשאת admin.
router.use(requireAdmin);
// מיפוי פעולות הניהול לפונקציות ה-Controller.
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
