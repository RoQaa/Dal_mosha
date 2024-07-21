const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: true
    },

    description: {
        type: String,
    },

    mainPrice: {
        type: Number,
        required: true
    },

    backgroundImage: {
        type: String,
    },

    clientType: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ClientType'
    },

    priceForClient: {
        type: Number,
        required: true
    },

    productIngredients: [{
        name: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        unit: {
            type: String,
        }
    }]
})


const Product = mongoose.model('Product', productSchema)
module.exports = Product;