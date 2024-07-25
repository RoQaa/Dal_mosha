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

      
      res.status(200).json({
        status:true,
        message:"Invoice created Successfully",
        data:{
            invoice:doc,
           
        }
      })
        
})

exports.confirmOrRefuseSupplierInvoice=catchAsync(async(req,res,next)=>{
    const doc = await Invoice.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true})
       if(!req.body.status||doc.status!=='fullfilled'){
        return res.status(200).json({
            status:true,
            message:"invoice refused"
        })
       }
    
            req.body.inventory_id=doc.to;
            req.body.invoice_id=doc._id
           
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
                message:"Confirmed Successfully",
                recipeQuantity
            })
        
       
})







