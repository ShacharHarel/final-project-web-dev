const express = require('express');
const {
    getAllContents,
    createContent,
    updateContent
} = require('../controllers/contentController');

const router = express.Router();

router.get('/', getAllContents);
router.post('/', createContent);
router.put('/:id', updateContent);

module.exports = router;
