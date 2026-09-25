const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String, 
        required: true
    }, 
    rating: {
        type: Number, 
        min: 1, 
        max: 5
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName avatar'
    });
})

module.exports = mongoose.model('Review', reviewSchema);