const CatchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');
const User = require('../models/userModel')
const Product = require('../models/productModel')

exports.toggleWishlistItem = CatchAsync(async (req, res, next) => {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product)
        return next(new AppError("Product not found", 404));

    const user = await User.findById(req.userId);
    const isAlreadyInWishlist = user.wishlist.includes(productId);

    let updateAction;
    let message;

    if (isAlreadyInWishlist) {
        updateAction = { 
            $pull: { wishlist: productId } 
        };
        message = "Product removed from wishlist";
    } else {
        updateAction = { 
            $addToSet: { wishlist: productId } 
        };
        message = "Product added to wishlist";
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        updateAction,
        { new: true }
    ).select('wishlist'); 

    res.status(200).json({ 
        status: 'success',
        message, 
        wishlist: updatedUser.wishlist 
    });
});

exports.getWishlist = CatchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
        path: 'wishlist',
        select: 'name price image stock'
    });
    res.status(200).json({ 
        status: 'success',
        wishlist: user.wishlist 
    });
});