const Inventory = require('../models/InventoryModel')
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');

exports.createInventory = catchAsync(async (req, res, next) => {
    const doc = await Inventory.create(req.body);
    res.status(201).json({
        status: true,
        message: "Inventory create Successfully",
        doc
    })
})
exports.getInventories = catchAsync(async (req, res, next) => {
    const data = await Inventory.find();
    if (!data || data.length === 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        data
    })
})
exports.getOneInventory = catchAsync(async (req, res, next) => {
    const doc = await Inventory.findById(req.params.id)
    if (!doc) return next(new AppError('cannot found that inventory', 404))
    res.status(200).json({
        status: true,
        doc
    })
})
exports.updateInventory = catchAsync(async (req, res, next) => {
    const doc = await Inventory.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if (!doc) return next(new AppError('cannot found that inventory', 404))
    res.status(200).json({
        status: true,
        message: "updated Successfully",
        doc
    })

})


exports.deleteInventory = catchAsync(async (req, res, next) => {
    await Inventory.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: true,
        message: "deleted Successfully"
    })
})