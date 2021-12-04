const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        _id: false,
        default: null,
        autopopulate: {
            maxDepth: 1
        }
    },
    transaction: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'transactions',
        _id: false,
        default: null,
        autopopulate: {
            maxDepth: 1
        }
    },
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'Product',
                _id: false,
                default: null,
                autopopulate: {
                    maxDepth: 1
                }
            },
            size: {
                type: String,
                required: true
            },
        }
    ],
    shippingDetails: {
        contactNumber: {
            type: String,
            required: true
        },
        firstName: { type: String },
        lastName: { type: String },
        company: { type: String },
        address: { type: String, required: true },
        apartment: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        pinCode: { type: String, required: true },
        newsletter: { type: Boolean, default: false },
        saveinfo: { type: Boolean, default: false }
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('orders', OrderSchema);