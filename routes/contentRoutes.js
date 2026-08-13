const express = require('express');
const {
    getAllContents,
    searchContents,
    createContent,
    updateContent,
    deleteContent
} = require('../controllers/contentController');

const router = express.Router();

router.get('/', getAllContents);
router.get('/search', searchContents);
router.post('/', createContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;
