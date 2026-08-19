// קובץ הגדרת מסד הנתונים: פותח חיבור יחיד בין Mongoose למסד MongoDB המקומי.
const mongoose = require('mongoose');

/** פותחת חיבור ל-MongoDB לפי MONGODB_URI; אם המשתנה חסר היא מדלגת ללא הפלת השרת. */
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
