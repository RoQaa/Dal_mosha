const Unit=require('../models/unitModel.js')
const AppError=require('../utils/appError')
const {catchAsync}=require('../utils/catchAsync')

exports.getUnits=catchAsync(async(req,res,next)=>{
    const data= await Unit.find();
    if(!data) return next(new AppError(`no data `,404))
        res.status(200).json({
            status:true,
            data
    })

})


exports.createUnit=catchAsync(async(req,res,next)=>{
    const data= await Unit.create(req.body);
    
        res.status(201).json({
            status:true,
            message:"Unit created Successfully",
            data
    })

})

exports.updateUnit=catchAsync(async(req,res,next)=>{
    const data=await Unit.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!data) return next(new AppError(`no data `,404))
        res.status(201).json({
            status:true,
            message:"Unit updated Successfully",
            data
    })

})

exports.deleteUnit=catchAsync(async(req,res,next)=>{
    await Unit.findByIdAndDelete(req.params.id)
   
        res.status(200).json({
            status:true,
            message:"Unit deleted Successfully",
            
    })

})

