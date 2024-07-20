const ClientType = require('../models/client-types.model');
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');


exports.addClientType = catchAsync(async (req, res, next) => {
    const clientType = await ClientType.create(req.body);

    if (!clientType) {
        return next(new AppError('غير قادر على إضافة نوع العميل ', 400));
    }

    res.status(201).json({
        status: true,
        message: "تم اضافه نوع العميل بنجاح",
        clientType
    });
});

exports.getClientType = catchAsync(async (req, res, next) => {

    const clientType = await ClientType.findById(req.params.id);

    return res.status(200).json({
        status: true,
        clientType
    })
})

exports.getAllClientTypes = catchAsync(async (req, res, next) => {

    const {type} = req.query;


    let filter = {};
    if (type) {
        filter.type = {$regex: type, $options: 'i'};
    }

    const allClientTypes = await ClientType.find(filter);

    return res.status(200).json({
        status: true,
        clientTypes: allClientTypes
    });
});

exports.updateClientType = catchAsync(async (req, res, next) => {
    const clientType = await ClientType.findByIdAndUpdate({
        _id: req.params.id,
    }, {...req.body}, {
        new: true, runValidators: true
    });
    if (!clientType) {
        return next(new AppError(`ClientType does not exist`, 404));
    }


    res.status(200).json({
        status: true,
        message: `ClientType have been updated successfully`,
        clientType
    });
});

exports.deleteClientType = catchAsync(async (req, res, next) => {


    const clientType = await ClientType.findByIdAndDelete(req.params.id);

    if (!clientType) {
        return next(new AppError(`ClientType does not exist`, 404));
    }

    res.status(200).json({
        status: true,
        message: "ClientType deleted Successfully"
    })


})