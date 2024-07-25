const mongoose = require('mongoose');

const twelveMonthsFromNow = () => {
    let date = new Date();
    date.setMonth(date.getMonth() + 12);
    return date;
};
const recipeQuantitySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        default:0,
        required: [true, 'must have quantity']
    },
    price: {
        type: Number,
        default:0,
        required: [true, 'must have price']
    },
    expire_date: {
        type: Date,
        default:twelveMonthsFromNow,
        required: [true, 'must have expire_date']
    },

    invoice_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Invoice',
        required: [true, 'must have invoice_id']

    },
    recipe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'recipe',
        required: [true, 'must have recipe_id']
    },
    
    inventory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'must have inventory']
    },
 


 
  

})


recipeQuantitySchema.pre(/^find/, function (next) {
    this.populate([
        {path: 'recipe_id'},
        {path: 'invoice_id'},
        {path: 'inventory_id'},
    ]);
    next();
});

const RecipeQuantity = mongoose.model('RecipeQuantity', recipeQuantitySchema)

module.exports = RecipeQuantity;