const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Category = require('../models/categoryModel');
const ApiFeature = require("../utils/apiFeature");
const Factory = require('./handlerFactory');

exports.getCategoryById = Factory.getOne(Category);
exports.getAllCategories = Factory.getAll(Category);
exports.addNewCategory = Factory.createOne(Category);
exports.updateCategory = Factory.updateOne(Category);
exports.deleteCategory = Factory.deleteOne(Category);