const express = require('express');
const { getPersonalFeed } = require('../controllers/feedController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:profileId', requireAuth, getPersonalFeed);

module.exports = router;
