const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number
    }, 
    stock: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
    },
    ratingAverage: {
        type: Number,
    },
    ratingQuantity: {
        type: Number,
    },
    isDeal: {
        type: Boolean,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);