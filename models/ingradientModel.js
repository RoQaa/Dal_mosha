const mongoose=require('mongoose')

const ingradientSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"must have name"],
        unique:[true,"this name used before"]
    },
    stock:{
        type:Number,
        required:[true,"must have stock"]
    },
    daysAlert:{
        type:Number,
        required:[true,'must have days alert']
    },
    expiryDate:{
        type:Date,
       required:[true,"must have expiry date"]
    },
    unit:{
        type:mongoose.Schema.ObjectId,
        ref:'Unit',
        required:[true,"Please Enter your unit"],
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,"Please Enter your Category"],
    },
    backgroundImage:{
        type:String,
        required:[true,"image required"]
    }

})

const Ingradient= mongoose.model('Ingradient',ingradientSchema);

module.exports=Ingradient;