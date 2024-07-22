const mongoose = require('mongoose')
const recipeCategorySchema = new mongoose.Schema({
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

    repo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repo",
        required: [true, "Please Enter your Repo"],
    },
})
/*
recipeCategorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'repo',
        select: 'name',
    })
    next();
})
*/
const RecipeCategory = mongoose.model('RecipeCategory', recipeCategorySchema)
module.exports = RecipeCategory;