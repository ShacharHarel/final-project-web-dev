const express = require('express');
const {
    getAllProfiles,
    searchProfiles,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../controllers/profileController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', getAllProfiles);
router.get('/search', searchProfiles);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

module.exports = router;
