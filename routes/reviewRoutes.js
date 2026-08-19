// Routes של ביקורות: CRUD וחיפוש ביקורות לפי תוכן.
const express = require('express');
const {
    getAllReviews,
    searchReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// כל פעולות הביקורות דורשות משתמש מחובר.
router.use(requireAuth);
// מיפוי נתיבי הרשימה, החיפוש וה-CRUD ל-Controller.
router.get('/', getAllReviews);
router.get('/search', searchReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
