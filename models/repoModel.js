const mongoose = require('mongoose')
const repoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        unique: [true, "name used before"]
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


const Repo = mongoose.model('Repo', repoSchema)
module.exports = Repo;