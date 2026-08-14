const express = require('express');
const { getShowInfo } = require('../controllers/externalController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/show', requireAuth, getShowInfo);

module.exports = router;
