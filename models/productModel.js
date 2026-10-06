const mongoose = require('mongoose');
const AppError = require('../utils/appError')

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
    description: String,
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    discountPrice: {
        type: Number,
        min: [0, 'Discount price cannot be negative'],
        validate: {
            // `this` is the document only on create/save; on updates it is the Query
            validator: function (val) {
                if (typeof this.price !== 'number') return true;
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) must be below the regular price'
        }
    }, 
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    },
    brand: String,
    ratingAverage: {
        type: Number,
        default: 4.5,
        max: [5.0, 'the rating must be below 5.0'],
        min: [1.0, 'the rating must be above 1.0']
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    isDeal: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.pre(/^find/, function() {
    this.populate({ path: 'category' })
})

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

//// if any item lacks stock, roll everything back through the session.

productSchema.statics.decreaseStock = async function (items, session) {
    if (!items.length) return;
    const ops = items.map(i => ({
    updateOne: {
        filter: {
            _id: i.product, 
            stock: { $gte: i.quantity } 
        },
        update: { $inc: { stock: -i.quantity } },
    },
    }));
    const result = await this.bulkWrite(ops, { session });
    if (result.modifiedCount !== items.length)
    throw new AppError('One or more products do not have enough stock', 400);
};

productSchema.statics.increaseStock = async function (items, session) {
    const ops = items.map(i => ({
    updateOne: { 
        filter: { _id: i.product }, 
        update: { $inc: { stock: i.quantity } } 
    },
    }));
    return this.bulkWrite(ops, { session });
};

module.exports = mongoose.model('Product', productSchema);