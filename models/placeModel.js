const mongoose=require('mongoose')
const placeSchema=mongoose.Schema({
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