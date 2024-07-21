const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "must have name"],
        unique: [true, "this name used before"]
    },
    stock: {
        type: Number,
        default: 0
        // required:[true,"must have stock"]
    },
    safeQuantity: {
        type: Number,
        required: [true, "must have safeQuantity"]
    },
    daysAlert: {
        type: Number,
        required: [true, 'must have days alert']
    },
    expiryDate: {
        type: Date,
        //  required:[true,"must have expiry date"]
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, "Please Enter your unit"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, "Please Enter your Category"],
    },
    backgroundImage: {
        type: String,
        required: [true, "backgroundImage required"]
    },


})

subCategorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',

    })
    next();
})

const subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;