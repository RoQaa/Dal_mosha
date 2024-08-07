const mongoose = require('mongoose')
const inventorySchema = new mongoose.Schema({

    name: {
        type: String,
        unique: [true, "must have a name"]
    },
    /*
    kind:{
        type:String,
        enum:['رئيسي','فرعي']
        
    },
    */
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place',
        required: [true, "must have place"]
    }
})

inventorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'place'
    }).select('-__v')
    next();
})


const Inventory = mongoose.model('Inventory', inventorySchema)

module.exports=Inventory