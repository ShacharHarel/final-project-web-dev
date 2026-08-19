// Routes של היסטוריית צפייה: CRUD וחיפוש רשומות של המשתמש המחובר.
const express = require('express');
const {
    getAllHistory,
    searchHistory,
    createHistory,
    updateHistory,
    deleteHistory
} = require('../controllers/watchHistoryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// כל הנתיבים בקובץ דורשים Session פעיל.
router.use(requireAuth);
// מיפוי פעולות הרשימה, החיפוש וה-CRUD ל-Controller.
router.get('/', getAllHistory);
router.get('/search', searchHistory);
router.post('/', createHistory);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

module.exports = router;
