const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    parentClassifications: {
        type: String,
        enum: ["Cafeteria", "Restaurants", "Sweets"],
        required: true,
    },
    backgroundImage: {
        type: String,
    }
})

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema)

module.exports = ProductCategory;