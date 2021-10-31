const mongoose = require('mongoose');

const SubCategorySchema = mongoose.Schema({
    subcategoryname: {
        type: String,
        required: true
    },
    categoryname: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('SubCategory', SubCategorySchema);