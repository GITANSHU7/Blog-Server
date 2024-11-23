const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        message: 'Title field is required'
    },
    
    sub_heading: {
        type: String,
        required: true,
        trim: true,
        message: 'Sub-Heading field is required',
        
    },
    description: {
        type: String,
        required: true,
        trim: true,
        message: 'Description field is required',
        
    },
    author: {
        type: String,
        required: true,
        trim: true,
        message: 'Author name field is required'
    },

    imageUrl: {
        type: String,
        required: true,
        message: 'Image URL is required',
    },
    
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);