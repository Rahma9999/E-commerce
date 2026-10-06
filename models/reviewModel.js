const mongoose = require('mongoose')
const Product = require('./productModel')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String, 
        required: true
    }, 
    rating: {
        type: Number, 
        min: 1, 
        max: 5,
        set: val => Math.round(val * 10) / 10
    }, 
    createAt: {
        type: Date,
        default: Date.now
    }, 
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to user.']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Preventing duplicate reviews
reviewSchema.index({product: 1, user: 1}, {unique: true});

reviewSchema.statics.calcAverageRatings = async function (productId) {
    const Product = mongoose.model('Product'); // avoids circular-import issues

    const stats = await this.aggregate([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    await Product.findByIdAndUpdate(productId, {
        ratingAverage: stats.length ? stats[0].avgRating : 4.5,
        ratingQuantity: stats.length ? stats[0].nRating : 0
    });
};

// findByIdAndUpdate / findByIdAndDelete / findOneAnd*
reviewSchema.post(/^findOneAnd/, async function (doc) {
    if (doc) {
        await this.model.calcAverageRatings(doc.product); 
    }
});

reviewSchema.post('save', async function() {
    await this.constructor.calcAverageRatings(this.product);
})

reviewSchema.pre(/^find/, function() {
    this.populate({
        path: 'user',
        select: 'firstName lastName avatar'
    });
})

module.exports = mongoose.model('Review', reviewSchema);