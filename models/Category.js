const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Category', CategorySchema);