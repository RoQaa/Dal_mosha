const multer = require('multer')
const sharp = require('sharp');
const fs =require('fs')
const mongoose=require('mongoose')
const Invoice=require('../models/invoiceModel')
const AppError=require('../utils/appError')
const {catchAsync}=require('../utils/catchAsync')


const multerFilter = (req, file, cb) => {

    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
const multerStorage = multer.memoryStorage();
const upload = multer({
    storage: multerStorage,
    // limits: { fileSize: 2000000 /* bytes */ },
    fileFilter: multerFilter
});
exports.uploadInvoicePhoto = upload.single('backgroundImage');

exports.resizeInvoicePhoto = catchAsync(async (req, res, next) => {
  
    if (!req.file) return next();
    let id 
    if(req.body.id){ id=req.body.id;}
    
    else{
        id=new mongoose.Types.ObjectId();
    }
    req.file.filename = `Invoice-${id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public\\img\\Invoices\\${req.file.filename}`);
       
    next();
});

//PuT
exports.createInvoice=catchAsync(async(req,res,next)=>{

    const doc = await Invoice.findOneAndUpdate(
        { _id: req.body.invoiceId || new mongoose.Types.ObjectId() },
        req.body,
        { new: true, upsert: true, runValidators: true }
    );

    
    
    
    
    res.status(200).json({
      status: true,
      message: "Invoice Created Successfully",
      data:doc
      
    });
    

    
       
    
      })




exports.getInvoices=catchAsync(async(req,res,next)=>{
    const Invoices=await Invoice.find();
    if(!Invoices||Invoices.length==0) return next(new AppError(`no data`,404))
        res.status(200).json({
            status:true,
            Invoices
    })
})



exports.updateInvoice=catchAsync(async (req,res,next)=>{
   
    
    const cat =await Invoice.findById(req.params.id);
    if(!cat){    return next(new AppError(`Invoice not found`,404))}
    if (req.file) {
         req.body.backgroundImage = `public\\img\\Invoices\\${req.file.filename}`;
    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
        
    });

  

    Object.assign(cat, req.body); // Assuming `updateData` contains fields to update
    await cat.save({ validateBeforeSave: false });

    res.status(200).json({
        status:true,
        message:`Successfully updated Invoice`,
        data:cat
    })
        
}})

exports.deleteInvoice=catchAsync(async(req,res,next)=>{
   const cat= await Invoice.findById(req.params.id)
    if(!cat) return next(new AppError(`Invoice not found`,404))
  
    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
    });
    
    await  Invoice.deleteOne();
    res.status(200).json({
        status:true,
        message:"Invoices deleted Successfully"
    })
})

exports.searchInvoice=catchAsync(async(req,res,next)=>{

    const doc = await Invoice.find(
       
          { 
          code: { $regex: req.params.term, $options: "i" }, 
          price: { $regex: req.params.term, $options: "i" },
          }
        
        
      ).limit(10);
      if(!doc||doc.length==0) return next(new AppError(`Invoice not found`,404))
        res.status(200).json({
            status:true,
            data:doc
        })
})
