const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const ApiFeature = require("../utils/apiFeature");
const Factory = require('./handlerFactory');

// exports.getAllProducts = CatchAsync(async (req, res, next) => {
//     const features = new ApiFeature(Product.find(), req.query)
//         .filter()
//         .sort()
//         .limitField()
//         .paginate();
    
//     const products = await features.query;
//     res.status(200).json({
//         status: 'success',
//         length: products.length,
//         data: {
//             products
//         }
//     });
// });

exports.getProudctById = CatchAsync(async (req, res, next) => {
    const id = req.params.id;
    if(!id)
        return next(new AppError('No product ID found', 400));
    
    const product = await Product.findOne({_id: id}).populate('reviews');
    if(!product)
        return next(new AppError(`There is no product with this ID: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

exports.checkCategory = CatchAsync(async (req, res, next) => {
    const check = await Category.findOne({slug: req.body.categorySlug});
    if(!check) {
        return next(new AppError('There is no category with this slug!!', 400));
    }
    req.body.categoryId = check._id;
    next();
});

exports.addNewProduct = Factory.createOne(Product);
exports.updateProduct = Factory.updateOne(Product);
exports.deleteProduct = Factory.deleteOne(Product);
exports.getAllProducts = Factory.getAll(Product);
