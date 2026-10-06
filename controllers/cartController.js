const Factory = require('./handlerFactory')
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError')

const MAX_QTY_PER_ITEM = 99;

const parseQuantity = (value = 1) => {
    const qty = Number(value);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM)
        throw new AppError(
            `Quantity must be a whole number between 1 and ${MAX_QTY_PER_ITEM}`,
            400
        );
    return qty;
};

const getOrCreateCart = async (userId) => {
    try {
        return await Cart.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { items: [] } },
            { upsert: true, returnDocument: 'after' }
        );
    } catch (err) {
        if (err.code === 11000) return Cart.findOne({ user: userId });
        throw err;
    }
};
exports.getCartId = CatchAsync(async (req, res, next) => {
    const cart = await getOrCreateCart(req.user.id);
    req.params.id = cart._id;
    next();
});

exports.getCart = Factory.getOne(Cart);

// { product, quantity }
// Add a new line, or increase the quantity if the product is already in the cart.
exports.addItemToCart = CatchAsync(async (req, res, next) => {
    const productId = req.body.product;
    if (!productId)
        return next(new AppError('Please provide a product id', 400));

    const qty = parseQuantity(req.body.quantity);

    const product = await Product.findById(productId).lean();
    if (!product)
        return next(new AppError('Product not found', 404));
    if (product.stock < qty)
        return next(new AppError('Not enough stock for that quantity', 400));

    const userId = req.user.id;
    const price = product.discountPrice ?? product.price;
    const newItem = {
        product: product._id, 
        name: product.name, 
        image: product.image, 
        price, 
        quantity: qty,
    };
    await getOrCreateCart(userId);
    
    const hasItem = { user: userId, 'items.product': product._id };
    const bump = { 
        $inc: { 'items.$.quantity': qty }, 
        $set: { 'items.$.price': price } 
    };

    let cart = await Cart.findOneAndUpdate(hasItem, bump, { returnDocument: 'after' });
    
    if (!cart) {
    cart = await Cart.findOneAndUpdate(
        { user: userId, 'items.product': { $ne: product._id } },
        { $push: { items: newItem } },
        { returnDocument: 'after' }
        );
    }

    // Another request pushed it between steps 1 and 2 -> increment now.
    if (!cart) cart = await Cart.findOneAndUpdate(hasItem, bump, { returnDocument: 'after' });

    res.status(200).json({
        status: 'success',
        data: { cart }
    })
});

exports.updateCartItem = CatchAsync(async (req, res, next) => {
    const qty = parseQuantity(req.body.quantity); 

    console.log(req.params.id, typeof(req.params.id))
    const current = await Cart.findOne({ 
        user: req.user.id,
        'items._id': req.params.id,
    }).lean();
    console.log(current)
    if (!current)
        return next(new AppError('Item not found in cart', 404));

    const line = current.items.find((i) => String(i._id) === req.params.id)
    const product = await Product.findById(line.product).lean();
    if (!product || product.stock < qty)
        return next(new AppError('Not enough stock for that quantity', 400));

    const cart = await Cart.findOneAndUpdate(
        {user: req.user.id, 'items._id': req.params.id},
        {$set: {'items.$.quantity': qty}},
        {returnDocument: 'after'}
    )

    if (!cart) return next(new AppError('Item not found in cart', 404));

    res.status(200).json({
        status: 'success',
        data: { cart }
    });
});

exports.removeItemFromCart = CatchAsync(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id, 'items._id': req.params.id },
        {$pull: {items: {_id : req.params.id }}},
        {returnDocument: 'after'}
    );
    if (!cart)
        return next(new AppError('Item not found in cart', 404));

    res.status(204).send();
});

exports.clearCart = CatchAsync(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user.id },
        {$set: { items: [] }}
    )
    res.status(204).send();
});