// Route של הפיד האישי: טוען פיד לפי id של פרופיל צפייה.
const express = require('express');
const { getPersonalFeed } = require('../controllers/feedController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// רק משתמש מחובר יכול לקבל פיד, וה-Controller בודק שהפרופיל שייך לו.
router.get('/:profileId', requireAuth, getPersonalFeed);

module.exports = router;
