const mongoose = require('mongoose')

const clientTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PaymentMethod",
        required: true,

    }

})


const ClientType = mongoose.model('ClientType', clientTypeSchema)
module.exports = ClientType;