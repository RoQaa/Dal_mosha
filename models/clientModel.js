const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    mobileNumber: {
        type: String
    },

    memberShipNumber: {
        type: String,

    },

    salary: {
        type: String,
    },

    Incentives: {
        
        type: String,
    },

    clientType: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientType'
    }
})


const Client = mongoose.model('Client', clientSchema)
module.exports = Client;