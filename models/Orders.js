const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    product: [{
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
        size: {
            type: String,
            required: true
        },
        orderQty: {
            type: String,
            required: true
        },
        currency: {
            type: String,
        },
        shipping: {
            type: String,
            required: true
        },
        productImages: [{
            type: String,
            required: true
        }],
    }],
    shippingDetails: {
        contactNumber: {
            type: String,
            required: true
        },
        firstName: { type: String },
        lastName: { type: String },
        company: { type: String },
        address: { type: String, required: true },
        appartment: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: String, required: true }
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('orders', OrderSchema);