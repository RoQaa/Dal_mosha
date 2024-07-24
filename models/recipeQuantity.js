/**
 *  'order',
        'quantity',
        'remaining',
        'price',
        'expire_date',
        'department_store_id',
        'invoice_id',
        'recipe_id',
        'total_price' => virtual
*/
/**        'from',
        'to',
        'supplier_id',
        'code',
        'invoice_date',
        'status',
        'invoice_price',
        'total_price',
        'image',
        'type',
        'discount',
        'tax',
        'note',
        'is_paid'
         */
        //TODO: here for inventory
const mongoose = require('mongoose');
const recipeQuantitySchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: [true, 'must have quantity']
    },
    price: {
        type: Number,
        required: [true, 'must have price']
    },
    expire_date: {
        type: Date,
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