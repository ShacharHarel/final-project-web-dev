// Routes של תכנים: קריאה וחיפוש פתוחים, בעוד יצירה, עדכון ומחיקה מוגנים למנהל.
const express = require('express');
const {
    getAllContents,
    searchContents,
    advancedSearch,
    searchByYear,
    getCategoryStats,
    getTypeStats,
    createContent,
    updateContent,
    deleteContent
} = require('../controllers/contentController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// פעולות קריאה, חיפוש וסטטיסטיקה.
router.get('/', getAllContents);
router.get('/search', searchContents);
router.get('/advanced-search', advancedSearch);
router.get('/year-search', searchByYear);
router.get('/stats/by-category', getCategoryStats);
router.get('/stats/by-type', getTypeStats);
// פעולות שינוי תוכן דורשות הרשאת admin.
router.post('/', requireAdmin, createContent);
router.put('/:id', requireAdmin, updateContent);
router.delete('/:id', requireAdmin, deleteContent);

module.exports = router;
