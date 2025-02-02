const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route to get all users
router.get('/all', usersController.getAllUsers);

// Route to query users based on criteria
router.get('/search', usersController.queryUsers);

module.exports = router;