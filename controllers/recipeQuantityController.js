
const mongoose=require('mongoose')
const RecipeQuantity = require('../models/recipeQuantity')
const AppError = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync')

exports.create = catchAsync(async (req, res, next) => {

    const doc = await RecipeQuantity.create(req.body);
    res.status(200).json({
        status: true,
        message: "created Successfully",
        data: doc
    })

})

exports.getRecipesQuantity = catchAsync(async (req, res, next) => {

    //  const data = await RecipeQuantity.find();

    const data = await RecipeQuantity.aggregate([
        {
            $match: {
                inventory_id:  mongoose.Types.ObjectId(req.params.inventory_id)
            }
        },
        {
            $group: {
                _id: null,
                totalQuantity: {
                    $sum: '$quantity'
                }
            }
        } // Group by null (single group) and sum the quantity field
    ]);

    if (!data) return next(new AppError('No Data', 404))
    res.status(200).json({
        status: true,
        data

    })
})
exports.getOneRecipesQuantity = catchAsync(async (req, res, next) => {
    const data = await RecipeQuantity.findById(req.params.id);
    if (!data) return next(new AppError('No Data', 404))
    res.status(200).json({
        status: true,
        data

    })
})


exports.updateRecipeQuantity = catchAsync(async (req, res, next) => {
    const doc = await RecipeQuantity.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!doc) return next(new AppError('cannot find that recipe Quantity', 404))
    res.status(200).json({
        status: true,
        message: "updated Successfully",
        data: doc
    })
})

exports.deleteRecipeQuantity = catchAsync(async (req, res, next) => {
    await RecipeQuantity.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: true,
        message: 'deleted Successfully'
    })
})