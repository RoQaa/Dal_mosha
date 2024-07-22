const mongoose = require('mongoose')


const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "must have name"],
        unique: [true, "this name used before"]
    },
    /*
    stock: {
        type: Number,
        default: 0
     
    },
    */
    minimum_limt: {
        type: Number,
        required: [true, "must have safeQuantity"]
    },
    days_before_expire: {
        type: Number,
        required: [true, 'must have days alert']
    },
    /*
    expiryDate: {
        type: Date,
        //  required:[true,"must have expiry date"]
    },
    */
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: [true, "Please Enter your unit"],
    },
    recipeCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RecipeCategory',
        required: [true, "Please Enter your RecipeCategory"],
    },
    backgroundImage: {
        type: String,
        required: [true, "backgroundImage required"]
    },
    /*
    invoice:{
        type:mongoose.Schema.ObjectId,
        ref:'Invoice', 
    },
    invoiceDepartment:{
        type:mongoose.Schema.ObjectId,
        ref:'InvoiceDepartment',
        
    }
*/


})

recipeSchema.pre(/^find/, function (next) {
    this.populate([
        { path: 'recipeCategory' },  // Example of selecting specific fields
      //  { path: 'invoice' }, 
        //{ path: 'invoiceDepartment', match: { active: true } }  // Example of matching criteria
    ]).select('-__v');
    next();
});


const recipe = mongoose.model('recipe', recipeSchema);

module.exports = recipe;