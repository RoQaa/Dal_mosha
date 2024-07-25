const multer = require('multer')
const sharp = require('sharp');
const mongoose=require('mongoose')
const Invoice = require('../models/invoiceModel')
const Inventory=require('../models/InventoryModel')
const RecipeQuantity = require('../models/recipeQuantity');
const AppError = require('../utils/appError')
const {catchAsync} = require('../utils/catchAsync');

const main_inventory_id=process.env.MAIN_INVENTORY_ID


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


   /**
     * -[x] check inventory from, 	
     * -[x] check inventory to,
     * -[x] get all quantities of (from) and chect about quantity u send
     * -[x] add minus (-) recipeQuantity for رئيسي
     * -[x] create new recipeQuantity for to
     * -[x] res
     */


exports.createCashingInvoice = catchAsync(async (req, res, next) => {
    req.body.from=main_inventory_id;
    const inventory_from= await Inventory.findById(main_inventory_id)

    if(!inventory_from||inventory_from.place.kind!=='رئيسي') 
        return next(new AppError(`don't have permission or inventory not found`,400))

            const inventory_to=await Inventory.findById(req.body.to)
                if(!inventory_to) return next(new AppError(`inventory_to not found`,404))

        req.body.kind='صرف'

        const doc = new Invoice(req.body);
        const id = doc._id.toString();

    if (!doc) return next(new AppError(`SomeThing went wrong`, 500));
    

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

exports.confirmOrRefuseCashingInvoice=catchAsync(async(req,res,next)=>{
    const doc = await Invoice.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true,runValidators:true})

       if(!req.body.status||doc.status!=='fullfilled'){
        return res.status(200).json({
            status:true,
            message:"invoice rejected"
        })
       }

       const data = await RecipeQuantity.aggregate([
        {
            $match: { inventory_id: mongoose.Types.ObjectId(main_inventory_id) } // Match the documents with the specified inventory_id
        },
        {
            $group: {
                _id: null, // Group all matched documents into one group
                totalQuantity: { $sum: "$quantity" } // Sum the quantities
            }
        }
    ]);
    console.log(data)
    if(data.quantity<req.body.quantity) return next(new AppError(`الكمية المطلوبة ليست موجودة بالمخزن`,400))
        
    const {recipe_id,quantity,price,expire_date,to}=req.body;

    const from_quantity=quantity * -1;
    const rec_from_main={
        inventory_id:main_inventory_id,    
        invoice_id: req.params.id,
        quantity: from_quantity,
        price:0,
        expire_date:expire_date,
        recipe_id:recipe_id
    }
    const rec_to_main={
        inventory_id:to,    
        invoice_id: req.params.id,
        quantity: quantity,
        price:price,
        expire_date:expire_date,
        recipe_id:recipe_id
    }
        const decrease_quantity_from = await RecipeQuantity.create(rec_from_main)
        const increase_quantity_to = await RecipeQuantity.create(rec_to_main)

        // TEST MODE
        /*
        const data1 = await RecipeQuantity.aggregate([
            {
                $match: { inventory_id: mongoose.Types.ObjectId(main_inventory_id) } // Match the documents with the specified inventory_id
            },
            {
                $group: {
                    _id: null, // Group all matched documents into one group
                    totalQuantity: { $sum: "$quantity" } // Sum the quantities
                }
            }
        ]);
        const data2 = await RecipeQuantity.aggregate([
            {
                $match: { inventory_id: mongoose.Types.ObjectId(to) } // Match the documents with the specified inventory_id
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
            message:"invoice full filled",
          //  data1,
           // data2,
           // increase_quantity_to,
           // decrease_quantity_from

        })
    
        
})










