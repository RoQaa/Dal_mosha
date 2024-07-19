const mongoose=require('mongoose');
const Ingredient=require('./ingradientModel')
const invoiceSchema = new mongoose.Schema({
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
   
})
invoiceSchema.pre('save', async function(next){

   const ing =  await Ingredient.findById(this.ingradient)
   ing.expiryDate=this.exp
   ing.stock+=this.quantity
   //this.exp=undefined
   await ing.save();

   next();
})

invoiceSchema.pre(/^find/,function(next){
    this.find().populate({
        path:'ingradient'
    })
})


const Invoice=mongoose.model('Invoice',invoiceSchema)
module.exports=Invoice;