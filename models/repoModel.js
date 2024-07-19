const mongoose=require('mongoose')
const repoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name required"],
        unique:[true,"name used before"]
    },
        desc:{
            type:String,
            
        },
        backgroundImage:{
            type:String
        },
        
        place:{
            type:mongoose.Schema.ObjectId,
            ref:"place",
            required:"must have In Inventory"
        }
        

})


const Repo=mongoose.model('Repo',repoSchema)
module.exports=Repo;