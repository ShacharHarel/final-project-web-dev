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

router.get('/', getAllContents);
router.get('/search', searchContents);
router.get('/advanced-search', advancedSearch);
router.get('/year-search', searchByYear);
router.get('/stats/by-category', getCategoryStats);
router.get('/stats/by-type', getTypeStats);
router.post('/', requireAdmin, createContent);
router.put('/:id', requireAdmin, updateContent);
router.delete('/:id', requireAdmin, deleteContent);

module.exports = router;
