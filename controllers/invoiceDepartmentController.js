
const mongoose = require('mongoose')
const InvoiceDepartment = require('../models/invoiceDepartmentModel')
const AppError = require('../utils/appError')
const { catchAsync } = require('../utils/catchAsync');


exports.createInvoice = catchAsync(async (req, res, next) => {
   

    const doc = await InvoiceDepartment.findOneAndUpdate(
        { _id: req.body.InvoiceDepartmentId || new mongoose.Types.ObjectId() },
        req.body,
        { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json({
        status: true,
        message: "InvoiceDepartment Created Successfully",
        data: doc

    });
})

exports.getInvoices = catchAsync(async (req, res, next) => {
    const Invoices = await InvoiceDepartment.find();
    if (!Invoices || Invoices.length == 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        Invoices
    })
})



exports.deleteInvoice = catchAsync(async (req, res, next) => {
     await InvoiceDepartment.findByIdAndDelete(req.params.id)
 
    res.status(200).json({
        status: true,
        message: "Invoices deleted Successfully"
    })
})

exports.searchInvoice = catchAsync(async (req, res, next) => {

    const doc = await InvoiceDepartment.find(

        {
            code: { $regex: req.params.term, $options: "i" },
            price: { $regex: req.params.term, $options: "i" },
          
        }


    ).limit(10);
    if (!doc || doc.length == 0) return next(new AppError(`Invoice not found`, 404))
    res.status(200).json({
        status: true,
        data: doc
    })
})

exports.searchInvoiceByDate=catchAsync(async(req,res,next)=>{ //done
  const {startDate,endDate }=req.body;
 
  const data = await InvoiceDepartment.find({
    invoiceDate: {
      $gte: startDate,
      $lte: endDate
    }
  });
  if(!data) return next(new AppError(`No data found`,404))
    res.status(200).json({
    status:true,
    data

})
})
exports.searchInvoiceByStatus=catchAsync(async(req,res,next)=>{ //done
    
   
    const data = await InvoiceDepartment.find({
      status:req.body.status
      
      
    });
    if(!data) return next(new AppError(`No data found`,404))
      res.status(200).json({
      status:true,
      data
  
  })
})
