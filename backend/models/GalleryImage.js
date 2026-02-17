const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        trim: true,
        default: ''
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
