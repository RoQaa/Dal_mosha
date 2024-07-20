const PaymentMethod = require('../models/paymentMethodsModel');
const AppError = require('../utils/appError');
const {catchAsync} = require('../utils/catchAsync');


exports.addPaymentMethod = catchAsync(async (req, res, next) => {
    const paymentMethod = await PaymentMethod.create(req.body);

    if (!paymentMethod) {
        return next(new AppError('غير قادر على إضافة طريقه الدفع', 400));
    }

    res.status(201).json({
        status: true,
        message: "تم اضافه طريقه الدفع بنجاح",
        paymentMethod
    });
});

exports.getPaymentMethod = catchAsync(async (req, res, next) => {

    const paymentMethod = await PaymentMethod.findById(req.params.id);

    return res.status(200).json({
        status: true,
        paymentMethod
    })
})

exports.getAllPaymentMethods = catchAsync(async (req, res, next) => {

    const {name} = req.query;


    let filter = {};
    if (name) {
        filter.name = {$regex: name, $options: 'i'};
    }

    const allPaymentMethods = await PaymentMethod.find(filter);

    return res.status(200).json({
        status: true,
        paymentMethods: allPaymentMethods
    });
});

exports.updatePaymentMethod = catchAsync(async (req, res, next) => {
    const paymentMethod = await PaymentMethod.findByIdAndUpdate({
        _id: req.params.id,
    }, {...req.body}, {
        new: true, runValidators: true
    });
    if (!paymentMethod) {
        return next(new AppError(`paymentMethod does not exist`, 404));
    }


    res.status(200).json({
        status: true,
        message: `Payment Method have been updated successfully`,
        paymentMethod
    });
});

exports.deletePaymentMethod = catchAsync(async (req, res, next) => {


    const paymentMethod = await PaymentMethod.findByIdAndDelete(req.params.id);

    if (!paymentMethod) {
        return next(new AppError(`Payment Method does not exist`, 404));
    }

    res.status(200).json({
        status: true,
        message: "Payment Method deleted Successfully"
    })


})