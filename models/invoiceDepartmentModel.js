const mongoose=require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Ingredient=require('./ingradientModel');
const AppError = require('../utils/appError');

const invoiceDepartmentSchema = new mongoose.Schema({
  repo:{
    type:mongoose.Schema.ObjectId,
    ref:"Repo",
    required:[true,'must have Repo']
  },
  invoiceDepartmentDate:{
    type:Date,
    required:[true,"must have Date"]
  },
  comment:String,

  ingradient:{
        type:mongoose.Schema.ObjectId,
        ref:'Ingradient',
        required:[true,'ingredient required']
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
        path:'ingradient'
    })
    next();
})
 // Pre-save hook
 invoiceDepartmentSchema.pre('findOneAndUpdate', async function(next) {
    
    const invoice = this._update;
    
      if(invoice.status!=='fullfilled') return next();
      
      const ingredient = await Ingredient.findById(invoice.ingradient);
      if(!ingredient) return next(new AppError(`ingrediant not found`,400))
          if (ingredient) {
              if(invoice.kind==='صرف'){
                  
                  ingredient.stock = Number(ingredient.stock || 0) - Number(invoice.quantity); // Sum stock
              }
              if(invoice.kind==='مرتجع'){
                 
                  ingredient.stock = Number(ingredient.stock || 0) + Number(invoice.quantity); // Sum stock
              }
          if(ingredient.stock<0)  ingredient.stock=0
      }
    
        await ingredient.save();
      next();
  });
  

const invoiceDepartment=mongoose.model('invoiceDepartment',invoiceDepartmentSchema)
module.exports=invoiceDepartment;
