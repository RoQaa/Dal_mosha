const mongoose=require('mongoose')

const paymentalSchema= new mongoose.Schema({
    value:{
        type:Number,
        required:[true,"must have value"]
    },
    note:{
        type:String,
        
    },
    kind:{
        type:String,
        enum:['فواتير','نثريات','الحوافز','المرتبات'],
        required:[true,'must have kind']
    },

    
})

const Paymental= mongoose.model('Paymental',paymentalSchema)

module.exports=Paymental;