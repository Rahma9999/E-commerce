const Category = require('../models/categoryModel');
const Factory = require('./handlerFactory');

exports.getCategoryById = Factory.getOne(Category);
exports.getAllCategories = Factory.getAll(Category);
exports.addNewCategory = Factory.createOne(Category);
exports.updateCategory = Factory.updateOne(Category);
exports.deleteCategory = Factory.deleteOne(Category);