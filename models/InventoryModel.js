const mongoose=require('mongoose')
const inventorySchema=new mongoose.Schema({

    name:{
        type:String,
        unique:[true,"must have a name"]
    },
    place:{
        type:mongoose.Schema.ObjectId,
        ref:'Place',
        required:[true,"must have place"]
    }
})

inventorySchema.pre(/^find/,function(next){
    this.populate({
        path:'place'
    })
    next();
})


const Inventory= mongoose.model('Inventory',inventorySchema)
module.exports=Inventory