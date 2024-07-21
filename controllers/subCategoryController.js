const multer = require('multer')
const sharp = require('sharp');
const fs =require('fs')
const Category=require('../models/categoryModel')
const Repo =require('../models/repoModel')
const subCategory =require('../models/subCategoryModel')
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
exports.uploadsubCategoryPhoto = upload.single('backgroundImage');

exports.resizesubCategoryPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `subCategory-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public\\img\\subCategorys\\${req.file.filename}`);
       
    next();
});


//TODO:test files in subCategorys
exports.createsubCategory=catchAsync(async(req,res,next)=>{
    const doc = new subCategory(req.body);
    const id = doc._id.toString();

    if (!doc) {
        return next(new AppError(`SomeThing Error cannot sign up`, 404));
      }
      if (req.file) {
        req.file.filename = `subCategory-${id}-${Date.now()}.jpeg`;
    
        await sharp(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public\\img\\subCategorys\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\subCategorys\\${req.file.filename}`;
      }

      await doc.save();
      res.status(201).json({
        status:true,
        message:"subCategory created Successfully",
        data:doc
      })
      })

exports.getsubCategorys=catchAsync(async(req,res,next)=>{
    
    const subCategorys=await subCategory.find();
    if(!subCategorys||subCategorys.length==0) return next(new AppError(`no data`,404))
        res.status(200).json({
            status:true,
            subCategorys
    })
            
           /*
    const data = await subCategory.aggregate([
        {
          $lookup: {
            from: Category.collection.name,
            localField: 'category',
            foreignField: '_id',
            as: 'category',
            pipeline: [
              {
                $lookup: {
                  from: Repo.collection.name,
                  localField: 'repo',
                  foreignField: '_id',
                  as: 'repo',
                  pipeline: [
                    // Add additional stages here if needed
                  ],
                },
              },
              {
                $unwind: '$repo', // Unwind if you expect a single repo per category
              },
            ],
          },
        },
        {
          $unwind: '$category', // Unwind if you expect a single category per subCategory
        },
      ]).exec();
      res.status(200).json({
        status:true,
        data
})*/
})



exports.updatesubCategory=catchAsync(async (req,res,next)=>{
   
    
    const cat =await subCategory.findById(req.params.id);
    if(!cat){    return next(new AppError(`subCategory not found`,404))}
    if (req.file) {
         req.body.backgroundImage = `public\\img\\subCategorys\\${req.file.filename}`;
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
        message:`Successfully updated subCategory`,
        data:cat
    })
        
}})

exports.deletesubCategory=catchAsync(async(req,res,next)=>{
   const cat= await subCategory.findById(req.params.id)
    if(!cat) return next(new AppError(`subCategory not found`,404))
  
    fs.unlink(`${cat.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
    });
    
    await  subCategory.deleteOne();
    res.status(200).json({
        status:true,
        message:"subCategorys deleted Successfully"
    })
})

exports.searchsubCategory=catchAsync(async(req,res,next)=>{

    const doc = await subCategory.find(
       
          { name: { $regex: req.params.term, $options: "i" } },
        
        
      ).limit(10);
      if(!doc||doc.length==0) return next(new AppError(`subCategory not found`,404))
        res.status(200).json({
            status:true,
            data:doc
        })
})

//TODO: get Ingerient of that invoice 