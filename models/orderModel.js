const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    paymentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    },
    totalPrice: {
        type: Number,
    },
    status: {
        type: String,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);