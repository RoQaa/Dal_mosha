const mongoose = require('mongoose')
const repoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
      
    },
    desc: {
        type: String,

    },
    backgroundImage: {
        type: String
    },

    inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: "must have In Inventory"
    }


})

repoSchema.pre(/^find/,function (next){
    this.populate({
        path:'inventory',
        
    })
    next();
})
const Repo = mongoose.model('Repo', repoSchema)
module.exports = Repo;