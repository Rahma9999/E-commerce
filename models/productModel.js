const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.pre(/^find/, function(next) {
    this.populate({ path: 'category' })
})

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

module.exports = mongoose.model('Product', productSchema);