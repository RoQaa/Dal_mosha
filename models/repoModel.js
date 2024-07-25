const mongoose = require('mongoose')
const repoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name required"],
        unique:[true,'must have unique name']
    },
    desc: {
        type: String,

    },
    backgroundImage: {
        type: String
    },

  

})


const Repo = mongoose.model('Repo', repoSchema)
module.exports = Repo;