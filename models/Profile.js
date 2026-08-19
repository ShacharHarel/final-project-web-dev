// Model של פרופיל צפייה: כל פרופיל שייך למשתמש ושומר גיל וקטגוריות מועדפות.
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    age: {
        type: Number,
        required: true,
        min: 1,
        max: 120
    },
    favoriteCategories: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
