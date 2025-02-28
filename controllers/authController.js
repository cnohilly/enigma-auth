import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });
};

export const register = async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: `${existingUser.email == req.body.email ? 'Email' : 'Username'} already in use.` });
        }

        const user = await User.create({ email, password, username, firstName, lastName });
        const userWithoutPw = user.toObject();
        delete userWithoutPw.password;
        const token = generateToken(user);

        res.status(201).json({ token, user: userWithoutPw });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.body;
    try {
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        jwt.verify(token, process.env.PUBLIC_KEY, {
            algorithms: ['RS256']
        }, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token',
                    error: err.message
                });
            }
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ valid: true, ...decoded });
        });

    } catch (err) {
        res.status(401).json({ valid: false, message: 'Invalid token' });
    }
};