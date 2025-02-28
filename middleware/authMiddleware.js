const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.PUBLIC_KEY, {
            algorithms: ['RS256']
        }, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token',
                    error: err.message
                });
            }

            req.user = await User.findById(decoded.id).select('-password');
            next();
        });

    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }

}

module.exports = protect;