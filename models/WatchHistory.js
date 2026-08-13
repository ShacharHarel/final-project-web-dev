const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    watchedMinutes: {
        type: Number,
        min: 0,
        default: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    watchedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);
