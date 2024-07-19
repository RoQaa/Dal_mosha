const mongoose=require('mongoose')
const priceSchema = new mongoose.Schema({

})


const Price=mongoose.model('Price',priceSchema)
module.exports=Price;