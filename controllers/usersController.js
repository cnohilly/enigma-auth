const User = require('../models/user');

// Controller to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excludes password field
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

// Controller to query users based on criteria
exports.queryUsers = async (req, res) => {
    try {
        const query = {};
        for (const [k, v] of Object.entries(req.query)) {
            query[k] = { $regex: v, $options: 'i' };
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to query users' });
    }
};