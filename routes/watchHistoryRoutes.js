const express = require('express');
const {
    getAllHistory,
    searchHistory,
    createHistory,
    updateHistory,
    deleteHistory
} = require('../controllers/watchHistoryController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', getAllHistory);
router.get('/search', searchHistory);
router.post('/', createHistory);
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

module.exports = router;
