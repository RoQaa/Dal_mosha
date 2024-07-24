const mongoose = require('mongoose')


const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "must have name"],
        unique: [true, "this name used before"]
    },
  
    minimum_limt: {
        type: Number,
        required: [true, "must have safeQuantity"]
    },
    days_before_expire: {
        type: Number,
        required: [true, 'must have days alert']
    },
  
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


})
recipeSchema.pre(/^find/,function(next){
    this.populate([{path:"unit"},{path:"recipeCategory"}])
    next();
})



const recipe = mongoose.model('recipe', recipeSchema);

module.exports = recipe;