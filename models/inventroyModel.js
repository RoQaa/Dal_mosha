const mongoose=require('mongoose')
const inventorySchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'must have a name'],
        unique:[true,'that name used before']
    },
    kind:{
        type:String,
        enum:['main','subMain']
    },
 
  

    
})