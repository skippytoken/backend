const mongoose = require('mongoose');
const autoPopulate = require("mongoose-autopopulate");

const TransactionSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        _id: false,
        default: null,
        autopopulate: {
            maxDepth: 1
        }
    },
    amount: {
        type: String,
        default: ''
    },
    buyer: {
        type: String,
        default: ''
    },
    coin: {
        type: String,
        enum: ['BNB', 'SKIPPY'],
        default: ['SKIPPY']
    },
    transactionHash: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['DEBIT', 'CREDIT'],
        required: true
    },
    status: {
        type: String,
        default: ''
    },
}, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
});

TransactionSchema.plugin(autoPopulate);

module.exports = mongoose.model('transactions', TransactionSchema);