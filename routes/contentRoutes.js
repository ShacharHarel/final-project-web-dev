const express = require('express');
const { getAllContents, createContent } = require('../controllers/contentController');

const router = express.Router();

router.get('/', getAllContents);
router.post('/', createContent);

module.exports = router;
