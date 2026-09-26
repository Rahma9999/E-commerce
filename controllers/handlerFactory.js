const AppError = require("../utils/appError");
const CatchAsync = require("../utils/catchAsync");
const ApiFeature = require('../utils/apiFeature');

exports.deleteOne = Model => 
    CatchAsync( async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc)
        return next(new AppError('No document found with that ID', 404));
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.updateOne = Model => 
    CatchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        });
        if (!doc) {
            return next(new AppError('No document found with this ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: doc
            }
        });
});

exports.createOne = Model => 
    CatchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);
        res.status(201).json({
            status: 'success', 
            data: {
                doc
            }
        });
});

exports.getAll = Model => 
    CatchAsync( async (req, res, next) =>{
        // To allow for nested GET review on product {hack}
        let filter = {}
        if(req.params.productId) filter = {product: req.params.productId}
        const features = new ApiFeature(Model.find(), req.query)
                .filter()
                .sort()
                .limitField()
                .paginate();
            
        const doc = await features.query;
        res.status(200).json({
            status: 'success',
            results: doc.length,
            data: {
                doc
            }
        });
    });

exports.getOne = (Model, popOptions) => 
    CatchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if(popOptions) query = query.populate(popOptions)

        const doc = await query;
        if(!doc)
            return next(new AppError(`There is no document with this ID: ${id}`, 404));

        res.status(200).json({
            status: 'success',
            data: {
                doc
            }
        });
});