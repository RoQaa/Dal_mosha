const mongoose = require('mongoose')

const paymentMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'من فضلك ادخل طريقه الدفع'],
        required: [true, 'طريقه الدفع موجوده بالفعل']
    },

})

const PaymentMethod = mongoose.model('PaymentMethods', paymentMethodSchema)
module.exports = PaymentMethod


