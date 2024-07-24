const multer = require('multer')
const sharp = require('sharp');
const fs = require('fs')
const mongoose = require('mongoose')
const Invoice = require('../models/invoiceModel')
const Inventory=require('../models/InventoryModel')
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync');
const RecipeQuantity = require('../models/recipeQuantity');


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
    if (req.body.id) {
        id = req.body.id;
    } else {
        id = new mongoose.Types.ObjectId();
    }
    req.file.filename = `Invoice-${id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public\\img\\Invoice\\${req.file.filename}`);

    next();
});


exports.createSupplierInvoice = catchAsync(async (req, res, next) => {
    const inventory= await Inventory.findById(req.body.to)

    if(!inventory||inventory.place.kind!=='رئيسي') 
        return next(new AppError(`don't have permission or inventory not found`,400))

        const doc = new Invoice(req.body);
        const id = doc._id.toString();

    if (!doc) 
        return next(new AppError(`SomeThing went wrong`, 500));
    

    if (req.file) {
        req.file.filename = `invoice-${id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat('jpeg')
            .jpeg({quality: 90})
            .toFile(`public\\img\\Invoice\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\Invoice\\${req.file.filename}`;
    }

         await doc.save();

        req.body.inventory_id=inventory._id;
        req.body.invoice_id=id

    /**  inventory_id, recipe_id  invoice_id    quantity    price   expire_date*/
    const {inventory_id,invoice_id,recipe_id,quantity,price,expire_date}=req.body;
    
    const rec={
        inventory_id:inventory_id,    
        invoice_id: invoice_id,
        quantity: quantity,
        price:price,
        expire_date:expire_date,
        recipe_id:recipe_id
    }

        const recipeQuantity= await RecipeQuantity.create(rec);
      res.status(200).json({
        status:true,
        message:"Invoice created Successfully",
        data:{
            invoice:doc,
            recipeQuantity
        }
      })
        
})

exports.createCashingInvoice=catchAsync(async(req,res,next)=>{

})
exports.createHulkInvoice=catchAsync(async(req,res,next)=>{

})
exports.createReturnedInvoice=catchAsync(async(req,res,next)=>{

})

exports.getInvoices = catchAsync(async (req, res, next) => {
    const Invoices = await Invoice.find();
    if (!Invoices || Invoices.length === 0) return next(new AppError(`no data`, 404))
    res.status(200).json({
        status: true,
        Invoices
    })
})



exports.updateInvoice = catchAsync(async (req, res, next) => {


    const cat = await Invoice.findById(req.params.id);
    if (!cat) { return next(new AppError(`Invoice not found`, 404)) }
    if (req.file) {
        req.body.backgroundImage = `public\\img\\Invoices\\${req.file.filename}`;
        fs.unlink(`${cat.backgroundImage}`, (err) => {
            console.log("image deleted")
            if (err) {
                console.log("Error:delete image ")
            }

        });



        Object.assign(cat, req.body); // Assuming `updateData` contains fields to update
        await cat.save({ validateBeforeSave: false });

        res.status(200).json({
            status: true,
            message: `Successfully updated Invoice`,
            data: cat
        })

    }
})

exports.deleteInvoice = catchAsync(async (req, res, next) => {
    const cat = await Invoice.findById(req.params.id)
    if (!cat) return next(new AppError(`Invoice not found`, 404))

    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if (err) {
            console.log("Error:delete image ")
        }
    });

    await Invoice.deleteOne();
    res.status(200).json({
        status: true,
        message: "Invoices deleted Successfully"
    })
})

exports.searchInvoice = catchAsync(async (req, res, next) => {

    const doc = await Invoice.find(
        {
            code: {$regex: req.params.term, $options: "i"},
            price: {$regex: req.params.term, $options: "i"},
            
        }
    ).limit(10);
    if (!doc || doc.length === 0) return next(new AppError(`Invoice not found`, 404))
    res.status(200).json({
        status: true,
        data: doc
    })
})

exports.searchInvoiceByDate = catchAsync(async (req, res, next) => { //done
    const {startDate, endDate} = req.body;

    const data = await Invoice.find({
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
        status: req.body.status

    });

    if (!data) return next(new AppError(`No data found`, 404))
    res.status(200).json({
        status: true,
        data

    })
})


