const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');    
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.createOrder = catchAsync(async (req, res, next) => {
    const { shippingAddress, paymentMethod } = req.body;

    // 1) The user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0)
        return next(new AppError('Your cart is empty', 400));

    // 2) ONE query for all products, then a Map for fast lookup
    const ids = cart.items.map(ci => ci.product);
    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = new Map(products.map(p => [String(p._id), p]));

    // 3) Build the snapshot from REAL product data
    const items = [];
    for (const ci of cart.items) {
        const p = byId.get(String(ci.product));
        if (!p)
        return next(new AppError(`"${ci.name}" is no longer available`, 400));

        items.push({
        product: p._id,
        name: p.name,
        image: p.image,
        unitPrice: p.discountPrice ?? p.price,
        quantity: ci.quantity,
        });
    }

    // 4) Prices (server-side only)
    const itemsPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 50;
    const totalPrice = itemsPrice + shippingPrice;

    // 5) All-or-nothing: stock + order + empty cart
    let order;
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
        await Product.decreaseStock(items, session);

        [order] = await Order.create(
            [{ user: req.user.id, items, shippingAddress, paymentMethod,
            itemsPrice, shippingPrice, totalPrice }],
            { session }
        );

        cart.items = [];
        await cart.save({ session });
        });
    } finally {
        await session.endSession();
    }

    res.status(201).json({ status: 'success', data: { order } });
});

exports.getMyOrders = catchAsync(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt').lean();
    res.status(200).json({ 
        status: 'success', 
        results: orders.length, 
        data: { 
            orders 
        } 
    });
});

exports.getOrder = catchAsync(async (req, res, next) => {
    const filter = { _id: req.params.id };
    filter.user = req.user.id;

    const order = await Order.findOne(filter).populate('user', 'firstName lastName email').lean();
    if (!order) 
        return next(new AppError('Order not found', 404));

    res.status(200).json({ 
        status: 'success', 
        data: { 
            order 
        } 
    });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    let order;
    const session = await mongoose.startSession();
    try{
        await session.withTransaction(async () => {
            order = await Order.findOneAndUpdate(
                { _id: req.params.id, user: req.user.id, status: 'pending' },
                { status: 'cancelled' },
                { returnDocument: 'after' }
            ).session(session);
            if(!order) return;

            await Product.increaseStock(order.items, session);
        });
    } finally {
        await session.endSession();
    }
    
    if (!order)
        return next(new AppError('Order not found or can no longer be cancelled', 400));

    res.status(200).json({ 
        status: 'success', 
        data: { 
            order 
        } 
    });
});

//////////////////// Admin ///////////////////
exports.getAllOrders = catchAsync(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort('-createdAt');

    res.status(200).json({ 
        status: 'success', 
        results: orders.length, 
        data: { 
            orders
        } 
    });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order)
        return next(new AppError('Order not found', 404));

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            order.status = status;
            if (status === 'paid') order.paidAt = Date.now();
            if (status === 'delivered') order.deliveredAt = Date.now();
            await order.save({ session });

            if (status === 'cancelled')
                await Product.increaseStock(order.items, session);
        });
    } finally {
        await session.endSession();
    }

    res.status(200).json({ 
        status: 'success', 
        data: { 
            order 
        } 
    });
});