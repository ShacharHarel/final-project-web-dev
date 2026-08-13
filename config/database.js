const mongoose = require('mongoose');

async function connectDatabase() {
    if (!process.env.MONGODB_URI) {
        console.log('MongoDB connection skipped: MONGODB_URI is not defined');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
}

module.exports = connectDatabase;

