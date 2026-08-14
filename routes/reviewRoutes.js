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

router.use(requireAuth);
router.get('/', getAllReviews);
router.get('/search', searchReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;
