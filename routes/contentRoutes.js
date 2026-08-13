const express = require('express');
const {
    getAllContents,
    searchContents,
    createContent,
    updateContent,
    deleteContent
} = require('../controllers/contentController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllContents);
router.get('/search', searchContents);
router.post('/', requireAdmin, createContent);
router.put('/:id', requireAdmin, updateContent);
router.delete('/:id', requireAdmin, deleteContent);

module.exports = router;
