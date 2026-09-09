const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Filter = require('../utils/filtering');
const ApiFeature = require("../utils/apiFeature");

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new ApiFeature(Product.find(), req.query)
        .filter()
        .sort()
        .limitField()
        .paginate();
    
    const products = await features.query;
    res.status(200).json({
        status: 'success',
        length: products.length,
        data: {
            products
        }
    });
});

exports.getProudctById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    if(!id)
        return next(new AppError('No product ID found', 400));
    
    const product = await Product.findOne({_id: id});
    if(!product)
        return next(new AppError(`There is no product with this ID: ${id}`));

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

exports.addNewProduct = catchAsync(async (req, res, next) => {
    const {
        categorySlug,
        name,
        description,
        price,
        discountPrice,
        stock,
        brand,
        ratingAverage,
        ratingQuantity,
        isDeal,
    } = req.body;
    const checkCategory = await Category.findOne({slug: categorySlug});
    if(!checkCategory) {
        return next(new AppError('There is no category with this slug!!', 400));
    }

    const product = await Product.create({
        categoryId: checkCategory._id,
        name,
        description,
        price,
        discountPrice,
        stock,
        brand,
        ratingAverage,
        ratingQuantity,
        isDeal,
    });
        res.status(201).json({
        status: 'success',
        data: {
            product
        }
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
        const newProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        });
        // console.log(req.params.id, req.body);
        // console.log(newProduct);
        if (!newProduct) {
            return next(new AppError('No product found with this ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                newProduct
            }
        });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
});
