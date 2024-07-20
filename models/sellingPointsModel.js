const mongoose = require('mongoose')

const placesSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'من فضلك ادخل اسم نقطه البيع'],
        required: [true, 'هّذا الاسم موجود بالفعل']
    },
    address: {
        type: String,
    },
    openingTime: {
        type: String,
        required: true,

    },
    closingTime: {
        type: String,
        required: true,

    },
    workingDays: {
        type: [String],
        //  required: [true, 'يرجى إدخال أيام العمل الخاصة']
    },
    backgroundImage: {
        type: String,
    }


})

const SellingPoints = mongoose.model('SellingPoints', sellingPointsSchema)
module.exports = SellingPoints


