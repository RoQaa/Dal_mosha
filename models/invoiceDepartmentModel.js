const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const invoiceDepartmentSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'must know from what Inventory']
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: [true, 'must know to what Inventory']
    },

    invoiceDepartmentDate: {
        type: Date,
        default:Date.now()
        //required: [true, "must have Date"]
    },
    comment: String,

    status: {
        type: String,
        enum: ['rejected', 'fullfilled', 'pending'],
        default: 'pending'
    },
    total_price: {
        type: Number,
        required: [true, 'must have price']
    },
    kind: {
        type: String,
        required: [true, 'must have type'],
        enum: ['مرتجع', 'صرف']
    },


    serialNumber: { type: String, unique: true, default: uuidv4 },


})

/*
invoiceDepartmentSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'recipe'
    })
    next();
})
    */
/*
// Pre-save hook
invoiceDepartmentSchema.pre('findOneAndUpdate', async function (next) {

    const invoice = this._update;

    if (invoice.status !== 'fullfilled') return next();


    const subrecipeCategory = await Recipe.findById(invoice.recipe);
    if (!subrecipeCategory) return next(new AppError(`Recipe not found`, 400))

    console.log(subrecipeCategory)

    if (subrecipeCategory) {
        if (invoice.kind === 'صرف') {

            subrecipeCategory.stock = Number(subrecipeCategory.stock || 0) - Number(invoice.quantity); // Sum stock
        }
        if (invoice.kind === 'مرتجع') {

            subrecipeCategory.stock = Number(subrecipeCategory.stock || 0) + Number(invoice.quantity); // Sum stock
        }
        if (subrecipeCategory.stock < 0) subrecipeCategory.stock = 0
    }

    await subrecipeCategory.save();
    next();
});
*/


const InvoiceDepartment = mongoose.model('InvoiceDepartment', invoiceDepartmentSchema)
module.exports = InvoiceDepartment;
