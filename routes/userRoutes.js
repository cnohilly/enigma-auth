const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const protect = require('../middleware/authMiddleware');

// Route to get all users
router.get('/all', protect, usersController.getAllUsers);

// Route to query users based on criteria
router.get('/search', protect, usersController.queryUsers);

module.exports = router;