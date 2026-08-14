const express = require('express');
const {
    getAllUsers,
    searchUsers,
    updateUserRole,
    deleteUser
} = require('../controllers/userController');
const { requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAdmin);
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

module.exports = router;
