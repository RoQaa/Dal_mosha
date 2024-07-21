const mongoose = require('mongoose');
const AppError = require(`${__dirname}/../utils/appError`);
const SubCategory = require('./subCategoryModel')
const invoiceSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, 'supplier required']
    },
    invoiceDate: {
        type: Date,
        default: Date.now(),
        required: [true, 'invoice date required']
    },
    code: {
        type: String,
        required: [true, 'code required']
    },
    backgroundImage: {
        type: String,
        required: [true, 'must have backgroundImage']
    },
    discount: {
        type: Number
    },
    tax: {
        type: Number
    },
    comment: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'must have price']
    },
    quantity: {
        type: Number,
        required: [true, 'must have quntitiy']
    },

    exp: Date,
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        required: [true, 'subCategory required']
    },
    status: {
        type: String,
        enum: ['rejected', 'fullfilled', 'pending'],
        default: 'pending'
    },
    kind: {
        type: String,
        required: [true, 'kind required'],
        enum: ['هالك', 'وارد']
    }


}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})
invoiceSchema.virtual('totalPrice').get(function () {
    return (this.price * this.quantity) + this.tax - this.discount;
});


// Pre-save hook
invoiceSchema.pre('findOneAndUpdate', async function (next) {

    const invoice = this._update;
    if (invoice.status !== 'fullfilled') return next();

    const subCategory = await SubCategory.findById(invoice.subCategory);
    if (!subCategory) return next(new AppError(`SubCategory not found`, 400))


    if (subCategory) {
        if (invoice.kind === 'وارد') {
            subCategory.expiryDate = invoice.exp;
            subCategory.stock = Number(subCategory.stock || 0) + Number(invoice.quantity); // Sum stock
        }
        if (invoice.kind === 'هالك') {
            subCategory.expiryDate = invoice.exp;
            subCategory.stock = Number(subCategory.stock || 0) - Number(invoice.quantity); // Sum stock
        }
        if (subCategory.stock < 0) subCategory.stock = 0
    }

    await subCategory.save();
    next();
});


invoiceSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'subCategory'
    })
    next();
})


const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice;
//TODO: Status تم  مراجعة والقبول 