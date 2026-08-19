// Route של השירות החיצוני: מאפשר למשתמש מחובר לבקש מידע על סדרה מ-TVmaze.
const express = require('express');
const { getShowInfo } = require('../controllers/externalController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/external/show?title=... מפעיל את ה-Controller החיצוני.
router.get('/show', requireAuth, getShowInfo);

module.exports = router;
