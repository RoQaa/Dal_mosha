const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs')
const mongoose = require('mongoose')
const Invoice = require('../models/invoiceModel')
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync');



//Kind in params or queries
exports.getInvoices = catchAsync(async (req, res, next) => {
    const Invoices = await Invoice.find({kind:req.params.kind});
    if (!Invoices || Invoices.length === 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        Invoices
    })
})


exports.searchByCodeInvoice = catchAsync(async (req, res, next) => {
    


    // Build the query object
    let search = {
        kind: req.query.kind,
         code: req.query.code
        
        
    };

    const doc = await Invoice.find(search).limit(10);
    if (!doc || doc.length === 0) return next(new AppError(`Invoice not found`, 404))
    res.status(200).json({
        status: true,
        length:doc.length,
        data: doc
    })
})




//Posts body
exports.searchInvoiceByDate = catchAsync(async (req, res, next) => { //done
    const {startDate, endDate} = req.body;

    const data = await Invoice.find({
        kind:req.body.kind,
        invoiceDate: {
            $gte: startDate,
            $lte: endDate
        }
    });
    if (!data) return next(new AppError(`No data found`, 404))
    res.status(200).json({
        status: true,
        data

    })
})
exports.searchInvoiceByStatus = catchAsync(async (req, res, next) => { //done


    const data = await Invoice.find({
        kind:req.body.kind,
        status: req.body.status

    });

    if (!data||data.length===0) return next(new AppError(`No data found`, 404))
    res.status(200).json({
        status: true,
        data

    })
})


