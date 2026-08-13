const express = require('express');
const { getAllContents } = require('../controllers/contentController');

const router = express.Router();

router.get('/', getAllContents);

module.exports = router;
