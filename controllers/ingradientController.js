const multer = require('multer')
const sharp = require('sharp');
const fs =require('fs')
const Ingradient =require('../models/ingradientModel')
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
exports.uploadIngradientPhoto = upload.single('backgroundImage');

exports.resizeIngradientPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `Ingradient-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public\\img\\Ingradients\\${req.file.filename}`);
       
    next();
});


//TODO:test files in ingredients
exports.createIngradient=catchAsync(async(req,res,next)=>{
    console.log(req.body)
    const ingredients = req.body; // Expecting an array of ingredients
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return next(new AppError(`No ingredients provided`, 400));
    }

    const createdIngredients = [];
    
    for (const ingredientData of ingredients) {
      const doc = new Ingradient(ingredientData);
      const id = doc._id.toString();

      if (req.file) {
        
        req.file.filename = `Ingredient-${id}-${Date.now()}.jpeg`;
        
        await sharp(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public\\img\\Ingredients\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\Ingredients\\${req.file.filename}`;
      }

      await doc.save();
      createdIngredients.push(doc);
    }

    res.status(201).json({
      status: true,
      message: "Ingredients Created Successfully",
      data: createdIngredients
    });
      })

exports.getIngradients=catchAsync(async(req,res,next)=>{
    const Ingradients=await Ingradient.find();
    if(!Ingradients||Ingradients.length==0) return next(new AppError(`no data`,404))
        res.status(200).json({
            status:true,
            Ingradients
    })
})



exports.updateIngradient=catchAsync(async (req,res,next)=>{
   
    
    const cat =await Ingradient.findById(req.params.id);
    if(!cat){    return next(new AppError(`Ingradient not found`,404))}
    if (req.file) {
         req.body.backgroundImage = `public\\img\\Ingradients\\${req.file.filename}`;
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
        message:`Successfully updated Ingradient`,
        data:cat
    })
        
}})

exports.deleteIngradient=catchAsync(async(req,res,next)=>{
   const cat= await Ingradient.findById(req.params.id)
    if(!cat) return next(new AppError(`Ingradient not found`,404))
  
    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
    });
    
    await  Ingradient.deleteOne();
    res.status(200).json({
        status:true,
        message:"Ingradients deleted Successfully"
    })
})

exports.searchIngradient=catchAsync(async(req,res,next)=>{

    const doc = await Ingradient.find(
       
          { name: { $regex: req.params.term, $options: "i" } },
        
        
      ).limit(10);
      if(!doc||doc.length==0) return next(new AppError(`Ingradient not found`,404))
        res.status(200).json({
            status:true,
            data:doc
        })
})
