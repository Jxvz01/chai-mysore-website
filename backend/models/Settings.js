const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    showPrices: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
