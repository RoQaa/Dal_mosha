const mongoose = require('mongoose');
const AppError = require(`${__dirname}/../utils/appError`);
//const Recipe = require('./recipeModel')
//TODO: update invoice model
const invoiceSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'supplier required']
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inventory',
       // required:[true,'need inventory {from}']

    },
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Inventory',
        required:[true,'need inventory {to}']

    },
  
    invoiceDate: {
        type: Date,
        default: Date.now(),
        required: [true, 'invoice date required']
    },
    code: {
        type: String,
        unique:[true,'must have 1'],
        required: [true, 'code required']
    },
    backgroundImage: {
        type: String,
        required: [true, 'must have backgroundImage']
    },
    discount: {
        type: Number
    },
    taxs: {
        type: Number
    },
    comment: {
        type: String
    },
    total_price: {
        type: Number,
      //  required: [true, 'must have price']
    },

    status: {
        type: String,
        enum: ['rejected', 'fullfilled', 'pending'],
        default: 'pending'
    },
    kind: {
        type: String,
        required: [true, 'kind required'],
        enum: ['صرف','مرتجع','هالك', 'وارد']
    }


})
    invoiceSchema.pre(/^find/,function(next){
        this.populate([
            {path:'supplier'},
            {path:'from'},
            {path:'to'}

        ])
        next();
    })

/*
invoiceSchema.virtual('totalPrice').get(function () {
    return (this.price * this.quantity) + this.tax - this.discount;
});


// Pre-save hook
invoiceSchema.pre('findOneAndUpdate', async function (next) {
    
    const invoice = this._update;
   
    if (invoice.status !== 'fullfilled') return next();

    const recipe = await Recipe.findById(invoice.recipe);
    if (!recipe) return next(new AppError(`Recipe not found`, 400))


    if (recipe) {
        if (invoice.kind === 'وارد') {
            recipe.expiryDate = invoice.exp;
            recipe.stock = Number(recipe.stock || 0) + Number(invoice.quantity); // Sum stock
        }
        if (invoice.kind === 'هالك') {
            recipe.expiryDate = invoice.exp;
            recipe.stock = Number(recipe.stock || 0) - Number(invoice.quantity); // Sum stock
        }
        if (recipe.stock < 0) recipe.stock = 0
    }

    await recipe.save();
    next();
});
*/
/*
invoiceSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'recipe'
    })
    next();
})

*/
const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice;
