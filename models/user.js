const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        validate: {
            validator: function (v) {
                return /[A-Z]/.test(v) && /\d/.test(v);
            },
            message: 'Password must contain at least one uppercase letter and one number'
        },
        select: false
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});


userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.post('validate', function (error, doc, next) {
    if (error.errors && error.errors.password) {
        error.errors.password.message = 'Password does not meet the complexity requirements';
    }
    next(error);
});

module.exports = mongoose.model('User', userSchema);