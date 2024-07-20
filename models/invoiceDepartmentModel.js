const mongoose=require('mongoose');
const AppError = require(`${__dirname}/../utils/appError`);
const Ingredient=require('./ingradientModel')
const invoiceDepartmentSchema = new mongoose.Schema({
    supplier:{
        type:mongoose.Schema.ObjectId,
        ref:'Supplier',
        required:[true,'supplier required']
    },
    invoiceDate:{
        type:Date,
        default:Date.now(),
        required:[true,'invoice date required']
    },
    code:{
        type:String,
        required:[true,'code required']
    },
    backgroundImage:{
        type:String,
        required:[true,'must have backgroundImage']
    },
    discount:{
        type:Number
    },
    tax:{
        type:Number
    },
    comment:{
        type:String
    },
    price:{
        type:Number,
        required:[true,'must have price']
    },
    quantity:{
        type:Number,
        required:[true,'must have quntitiy']
    },

    exp:Date,
    ingradient:{
        type:mongoose.Schema.ObjectId,
        ref:'Ingradient',
        required:[true,'ingredient required']
    },
    status:{
        type:String,
        enum:['rejected','fullfilled','pending'],
        default:'pending'
    },
 
   
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})



invoiceSchema.pre(/^find/,function(next){
    this.find().populate({
        path:'ingradient'
    })
    next();
})


const invoiceDepartment=mongoose.model('invoiceDepartment',invoiceDepartmentSchema)
module.exports=invoiceDepartment;
//TODO: Status تم  مراجعة والقبول 