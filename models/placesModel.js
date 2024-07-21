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
    },
    kind:{
        type:String,
        enum:['فرعي','رئيسي'],
        default:'فرعي'
    }



})

const Place = mongoose.model('Place', placesSchema)
module.exports = Place


