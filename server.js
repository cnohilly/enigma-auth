const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

const corsOriginCheck = (origin, callback) => {
    if (process.env.CORS_ORIGINS.split(';').includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error(`Origin (${origin}) not allowed in CORS`));
    }
}
const corsOptions = {
    origin: corsOriginCheck,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));