const multer = require('multer')
const sharp = require('sharp');
const fs =require('fs')
const Repo=require('../models/repoModel')
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
exports.uploadRepoPhoto = upload.single('backgroundImage');

exports.resizeRepoPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `repo-${req.params.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(1300, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public\\img\\repos\\${req.file.filename}`);
       
    next();
});





exports.createRepo=catchAsync(async(req,res,next)=>{
    const doc = new Repo(req.body);
    const id = doc._id.toString();

    if (!doc) {
        return next(new AppError(`SomeThing Error cannot sign up`, 404));
      }
      if (req.file) {
        req.file.filename = `repo-${id}-${Date.now()}.jpeg`;
    
        await sharp(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public\\img\\repos\\${req.file.filename}`);
        doc.backgroundImage = `public\\img\\repos\\${req.file.filename}`;
      }

      await doc.save();
      res.status(201).json({
        status:true,
        message:"Repo Created Successfully",
        data:doc
      })
    
})
exports.getRepos=catchAsync(async(req,res,next)=>{
    const repos=await Repo.find({inventory:req.params.id});
    if(!repos||repos.length==0) return next(new AppError(`no data`,404))
        res.status(200).json({
            status:true,
            repos
    })
})



exports.updateRepo=catchAsync(async (req,res,next)=>{
   
    
    const repo =await Repo.findById(req.params.id);
    if(!repo){    return next(new AppError(`repo not found`,404))}
    if (req.file) {
         req.body.backgroundImage = `public\\img\\repos\\${req.file.filename}`;
    fs.unlink(`${repo.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
        
    });

  

    Object.assign(repo, req.body); // Assuming `updateData` contains fields to update
    await repo.save({ validateBeforeSave: false });

    res.status(200).json({
        status:true,
        message:`Successfully updated repo`,
        repo
    })
        
}})

exports.deleteRepo=catchAsync(async(req,res,next)=>{
   const repo= await Repo.findById(req.params.id)
    if(!repo) return next(new AppError(`repo not found`,404))
   console.log(repo)
   
    fs.unlink(`${repo.backgroundImage}`, (err) => {
        console.log("image deleted")
        if(err){
            console.log("Error:delete image ")
        }
    });
    
    await  repo.deleteOne();
    res.status(200).json({
        status:true,
        message:"repos deleted Successfully"
    })
})

exports.searchRepo=catchAsync(async(req,res,next)=>{

    const doc = await Repo.find(
       
          { name: { $regex: req.params.term, $options: "i" } },
        
        
      ).limit(10);
      if(!doc||doc.length==0) return next(new AppError(`Repo not found`,404))
        res.status(200).json({
            status:true,
            data:doc
        })
})
