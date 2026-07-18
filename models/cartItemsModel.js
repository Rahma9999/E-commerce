const mongoose = require('mongoose');

const cartItemsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CartItems', cartItemsSchema);