const Supplier=require('../models/supplierModel')
const AppError=require('../utils/appError')
const {catchAsync}=require('../utils/catchAsync')

exports.createSupplier=catchAsync(async(req,res,next)=>{
    const sup=await Supplier.create(req.body)
    res.status(201).json({
        status:true,
        message:"supplier create Successfully",
        data:sup
    })
})

exports.getSuppliers=catchAsync(async(req,res,next)=>{
    const data=await Supplier.find();
    if(!data) return next(new AppError(`No data`,404))
        res.status(200).json({
            status:true,
            data
    })
})
exports.updateSupplier=catchAsync(async(req,res,next)=>{
    const doc= await Supplier.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    if(!doc){
        return next(new AppError(`cannot find that supplier`,404)) 
    }
    res.status(200).json({
        status:true,
        message:"Supplier updated successfully",
        doc
    })
})

exports.deleteSupplier=catchAsync(async(req,res,next)=>{
    await Supplier.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status:true,
        message:"supplier deleted Successfully"
    })
})

exports.searchSupplier=catchAsync(async(req,res,next)=>{
  
    const suppliers = await Supplier.find({
        $or: [
          { name: { $regex: req.params.term, $options: "i" } },
          { phone: { $regex: req.params.term, $options: "i" } },
          { kind: { $regex: req.params.term, $options: "i" } },
        ]
      }).limit(10);
      if(!suppliers||suppliers.length==0) return next(new AppError(`supplier not found`,404))
        res.status(200).json({
            status:true,
            data:suppliers
        })
})



   