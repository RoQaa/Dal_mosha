const mongoose=require('mongoose');

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
    image:{
        type:String,
        required:[true,'must have image']
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
    quantity:Number,
    price:Number,
    
    ingradient:{
        type:mongoose.Schema.ObjectId,
        ref:'Ingradient',
        required:[true,'ingredient required']
    }
})


const Invoice=mongoose.model('Invoice',invoiceSchema)
module.exports=Invoice;