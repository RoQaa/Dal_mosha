const mongoose=require('mongoose');
const AppError = require(`${__dirname}/../utils/appError`);
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

// Pre-save hook
invoiceSchema.pre('findOneAndUpdate', async function(next) {
  const invoice = this;

  try {
    const ingredient = await Ingredient.findById(invoice.ingradient);
    if (ingredient) {
      ingredient.expiryDate = invoice.exp;
      ingredient.stock = (ingredient.stock || 0) + invoice.quantity; // Sum stock
      await ingredient.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

invoiceSchema.pre(/^find/,function(next){
    this.find().populate({
        path:'ingradient'
    })
    next();
})


const Invoice=mongoose.model('Invoice',invoiceSchema)
module.exports=Invoice;