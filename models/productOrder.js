const mongoose=require('mongoose')
const productOrderSchema = new mongoose.Schema({

})


const ProductOrder=mongoose.model('ProductOrder',productOrderSchema)

module.exports=ProductOrder;