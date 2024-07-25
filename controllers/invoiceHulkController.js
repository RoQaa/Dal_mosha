const multer = require('multer')
const sharp = require('sharp');
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



exports.createHulkInvoice = catchAsync(async (req, res, next) => {
    const inventory= await Inventory.findById(req.body.to)
    if(!inventory) return next(new AppError(`{to} inventory not found`,404))
        req.body.kind='هالك'
        
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

exports.confirmOrRefuseHulkInvoice=catchAsync(async(req,res,next)=>{
    const doc = await Invoice.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true})
       if(!req.body.status||doc.status!=='fullfilled'){
        return res.status(200).json({
            status:true,
            message:"invoice rejected"
        })
       }

            req.body.inventory_id=doc.to;
            req.body.invoice_id=doc._id
                  const data = await RecipeQuantity.aggregate([
        {
            $match: { inventory_id: mongoose.Types.ObjectId(req.body.to) } // Match the documents with the specified inventory_id
        },
        {
            $group: {
                _id: null, // Group all matched documents into one group
                totalQuantity: { $sum: "$quantity" } // Sum the quantities
            }
        }
    ]);
    console.log(data)
    console.log('quntitiy',data[0].totalQuantity)
    if(data[0].totalQuantity < req.body.quantity) return next(new AppError(`الكمية المطلوبة ليست موجودة بالمخزن`,400))
        
        const {invoice_id,recipe_id,quantity,expire_date,to}=req.body;
        const minus_qunatity=quantity * -1;
        const rec={
            inventory_id:to,    
            invoice_id: invoice_id,
            quantity: minus_qunatity,
            price:0,
            expire_date:expire_date,
            recipe_id:recipe_id
        }
    
            const recipeQuantity= await RecipeQuantity.create(rec)
            if(!recipeQuantity) return next(new AppError('recipe Quantity not found',404))
/*
                const data2 = await RecipeQuantity.aggregate([
                    {
                        $match: { inventory_id: mongoose.Types.ObjectId(req.body.to) } // Match the documents with the specified inventory_id
                    },
                    {
                        $group: {
                            _id: null, // Group all matched documents into one group
                            totalQuantity: { $sum: "$quantity" } // Sum the quantities
                        }
                    }
                ]);
*/


            res.status(200).json({
                status:true,
                message:"Confirmed Successfully",
              //  data,
               // data2,
              //  recipeQuantity
            })
        
       
})
