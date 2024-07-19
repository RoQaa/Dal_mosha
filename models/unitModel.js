const mongoose=require('mongoose')

const unitSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"must have a name"]
    }
})
 unitSchema.pre(/^find/,function(next){
    this.select('-__v')
    next();
 })
const Unit =mongoose.model('Unit',unitSchema);

module.exports=Unit;