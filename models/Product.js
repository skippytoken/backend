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
    xlargesizeavailqty: {
        type: String,
        required: true
    },
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
    prodImg1: {
        type: String,
        required: true
    },
    prodImg2: {
        type: String,
        required: false
    },
    prodImg3: {
        type: String,
        required: false
    },
    prodImg4: {
        type: String,
        required: false
    },
    prodImg5: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', ProductSchema);