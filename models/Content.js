// Model של תוכן: מגדיר כיצד סרט או סדרה נשמרים באוסף contents ב-MongoDB.
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['movie', 'series'],
        required: true
    },
    releaseYear: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    videoUrl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Content', contentSchema);
