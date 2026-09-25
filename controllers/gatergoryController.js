const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Category = require('../models/categoryModel');
const ApiFeature = require("../utils/apiFeature");
const Factory = require('./handlerFactory');

// exports.getAllCategories = catchAsync(async (req, res, next) => {
//     const features = new ApiFeature(Category.find(), req.query)
//         .filter()
//         .sort()
//         .limitField()
//         .paginate();
    
//     const categories = await features.query;
//     res.status(200).json({
//         status: 'success',
//         length: categories.length,
//         data: {
//             categories
//         }
//     });
// });

exports.getProudctById = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    if(!id)
        return next(new AppError('No Category ID found', 400));
    
    const cat = await Category.findOne({_id: id});
    if(!cat)
        return next(new AppError(`There is no Category with this ID: ${id}`, 404));

    res.status(200).json({
        status: 'success',
        data: {
            cat
        }
    });
});

exports.getAllCategories = Factory.getAll(Category);
exports.addNewCategory = Factory.createOne(Category);
exports.updateCategory = Factory.updateOne(Category);
exports.deleteCategory = Factory.deleteOne(Category);