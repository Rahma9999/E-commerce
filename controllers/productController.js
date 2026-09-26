const CatchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const ApiFeature = require("../utils/apiFeature");
const Factory = require('./handlerFactory');

exports.checkCategory = CatchAsync(async (req, res, next) => {
    const check = await Category.findOne({slug: req.body.categorySlug});
    if(!check) {
        return next(new AppError('There is no category with this slug!!', 400));
    }
    req.body.categoryId = check._id;
    next();
});

exports.addNewProduct = Factory.createOne(Product);
exports.getProudctById = Factory.getOne(Product, {path: 'reviews'});
exports.updateProduct = Factory.updateOne(Product);
exports.deleteProduct = Factory.deleteOne(Product);
exports.getAllProducts = Factory.getAll(Product);
