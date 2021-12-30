const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    productname: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    mrp: {
        type: String,
        required: true
    },
    currency: {
        type: String
    },
    smallsizeavailqty: {
        type: String,
        required: true
    },
    mediumsizeavailqty: {
        type: String,
        required: true
    },
    largesizeavailqty: {
        type: String,
        required: true
    },
    // xlargesizeavailqty: {
    //     type: String,
    //     required: true
    // },
    description: {
        type: String,
        required: true
    },
    specifications: {
        type: String,
        required: true
    },
    washandcare: {
        type: String,
        required: true
    },
    shipping: {
        type: String,
        required: true
    },
    productImages: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', ProductSchema);