const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
       // required: [true, 'supplier required']
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
        required: [true, 'must have price']
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


const Invoice = mongoose.model('Invoice', invoiceSchema)
module.exports = Invoice;
