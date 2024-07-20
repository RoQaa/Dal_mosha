const Paymental = require('../models/paymentalModel')
const AppError = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync');

exports.createPaymental=catchAsync(async(req,res,next)=>{
    const doc = await Paymental.create(req.body);
    res.statu(201).json({
        status:true,
        message:"paymental created Successfully",
        doc
    })
})

exports.getPaymentals=catchAsync(async(req,res,next)=>{
    const data =await Paymental.find();
    if(!data) return next(new AppError(`No Data`,404))
        res.status(200).json({
    status:true,
    data
    })
})
