const Client = require('../models/clientModel');
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');


exports.addClient = catchAsync(async (req, res, next) => {
    const client = await Client.create(req.body);

    if (!client) {
        return next(new AppError('غير قادر على إضافة العميل ', 400));
    }

    res.status(201).json({
        status: true,
        message: "تم اضافه العميل بنجاح",
        client
    });
});

exports.getClient = catchAsync(async (req, res, next) => {

    const clientType = await Client.findById(req.params.id);

    return res.status(200).json({
        status: true,
        clientType
    })
})

exports.getAllClients = catchAsync(async (req, res, next) => {

    const {name} = req.query;

    console.log(req.query)


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const allClientTypes = await Client.find(filter);

    return res.status(200).json({
        status: true,
        clientTypes: allClientTypes
    });
});

exports.updateClient = catchAsync(async (req, res, next) => {
    const clientType = await Client.findByIdAndUpdate({
        _id: req.params.id,
    }, {...req.body}, {
        new: true, runValidators: true
    });
    if (!clientType) {
        return next(new AppError(`Client does not exist`, 404));
    }


    res.status(200).json({
        status: true,
        message: `Client have been updated successfully`,
        clientType
    });
});

exports.deleteClient = catchAsync(async (req, res, next) => {


    const clientType = await Client.findByIdAndDelete(req.params.id);

    if (!clientType) {
        return next(new AppError(`Client does not exist`, 404));
    }

    res.status(200).json({
        status: true,
        message: "Client deleted Successfully"
    })


})