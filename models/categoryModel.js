const mongoose=require('mongoose')
const categorySchema = new mongoose.Schema({
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
       
        repo:{
            type:mongoose.Schema.ObjectId,
                ref:"Repo",
                required:[true,"Please Enter your Repo"],
            },
})

categorySchema.pre(/^find/,function (next){
    this.populate({
        path:'repo',
        select:'name',
    })
    next();
})

const Category=mongoose.model('Category',categorySchema)
module.exports=Category;