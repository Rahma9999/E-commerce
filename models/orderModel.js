const mongoose = require('mongoose');

const orderItemsSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    image: String,
    quantity: {
        type: Number,
        min: [1, 'the quantity must be above 1']
    },
    unitPrice: {
        type: Number,
        required: true,
        min: [1.0, 'The product cannot be less than 0']
    }
},
{_id: false});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Order must belong to a user']
    },
    items: {
        type: [ orderItemsSchema ],
        validate: [(v) => v.length > 0, 'Order must have at least one item'],
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash_on_delivery', 'card'],
        default: 'cash_on_delivery',
    },
    itemsPrice: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingPrice: { 
        type: Number, 
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true,
        },
    paidAt: Date,
    deliveredAt: Date,
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment'
    },
}, {
    timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);