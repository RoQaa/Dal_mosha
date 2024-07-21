const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');
const SubCategory=require('./subCategoryModel');
const AppError = require('../utils/appError');

const invoiceDepartmentSchema = new mongoose.Schema({
  from:{
    type:mongoose.Schema.ObjectId,
    ref:'Inventory',
    required:[true,'must know from what Inventory']
  },
  to:{
    type:mongoose.Schema.ObjectId,
    ref:'Inventory',
    required:[true,'must know to what Inventory']
  },

  invoiceDepartmentDate:{
    type:Date,
    required:[true,"must have Date"]
  },
  comment:String,

  subCategory:{
        type:mongoose.Schema.ObjectId,
        ref:'subCategory',
        required:[true,'subcategory required']
    },
  quantity:{
    type:Number,
    required:[true,"must have quantity"]
  },

  status:{
    type:String,
    enum:['rejected','fullfilled','pending'],
    default:'pending'
},
price:{
    type:Number,
    required:[true,'must have price']
},
    kind:{
        type:String,
        required:[true,'must have type'],
        enum:['مرتجع','صرف']
    },


    serialNumber: { type: String, unique: true, default: uuidv4 },

   
})



invoiceDepartmentSchema.pre(/^find/,function(next){
    this.find().populate({
        path:'subCategory'
    })
    next();
})
 // Pre-save hook
 invoiceDepartmentSchema.pre('findOneAndUpdate', async function(next) {
    
    const invoice = this._update;
    
      if(invoice.status!=='fullfilled') return next();
      
      
      const subcategory = await SubCategory.findById(invoice.subCategory);
      if(!subcategory) return next(new AppError(`SubCategory not found`,400))

          console.log(subcategory)
   
          if (subcategory) {
              if(invoice.kind==='صرف'){
                  
                  subcategory.stock = Number(subcategory.stock || 0) - Number(invoice.quantity); // Sum stock
              }
              if(invoice.kind==='مرتجع'){
                 
                  subcategory.stock = Number(subcategory.stock || 0) + Number(invoice.quantity); // Sum stock
              }
          if(subcategory.stock<0)  subcategory.stock=0
      }
    
        await subcategory.save();
      next();
  });
  

const invoiceDepartment=mongoose.model('invoiceDepartment',invoiceDepartmentSchema)
module.exports=invoiceDepartment;
