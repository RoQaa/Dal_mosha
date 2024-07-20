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
    status:{
        type:String,
        enum:['rejected','fullfilled','pending'],
        default:'pending'
    },
    kind:{
        type:String,
        required:[true,'kind required'],
        enum:['هالك','وارد']
    }
 
   
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
})
invoiceSchema.virtual('totalPrice').get(function(){
  return (this.price*this.quantity)+this.tax-this.discount;
}); 


// Pre-save hook
invoiceSchema.pre('findOneAndUpdate', async function(next) {
    
  const invoice = this._update;
    if(invoice.status!=='fullfilled') return next();
  
    const ingredient = await Ingredient.findById(invoice.ingradient);
        
        if (ingredient) {
            if(invoice.kind==='وارد'){
                ingredient.expiryDate = invoice.exp;
                ingredient.stock = Number(ingredient.stock || 0) + Number(invoice.quantity); // Sum stock
            }
            if(invoice.kind==='هالك'){
                ingredient.expiryDate = invoice.exp;
                ingredient.stock = Number(ingredient.stock || 0) - Number(invoice.quantity); // Sum stock
            }
        if(ingredient.stock<0)  ingredient.stock=0
    }
  
      await ingredient.save();
    next();
});



invoiceSchema.pre(/^find/,function(next){
    this.find().populate({
        path:'ingradient'
    })
    next();
})


const Invoice=mongoose.model('Invoice',invoiceSchema)
module.exports=Invoice;
//TODO: Status تم  مراجعة والقبول 