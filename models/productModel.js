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

productScehma.statics.decreaseStock = async function(cartItems){
    const bulkOperations = cartItems.map(item => {
    return {
        updateOne: {
            filter: { 
                _id: item.productId, 
                stock: { $gte: item.quantity } // Ensures stock doesn't go negative
            }, 
            update: { 
                $inc: { stock: -item.quantity } 
            }
        }
        };
    });

    const result = await this.bulkWrite(bulkOperations);
    return result;
}

module.exports = mongoose.model('Product', productSchema);