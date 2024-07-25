const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Supplier Name"],
    unique: [true, "there's a Supplier with that name "],
    trim: true,
  },

  phone: {
    type: String,
    required: [true, "phone required"],
    unique: [true, "this phone used before"],
  },

  kind: {
    type: String,
    required: [true, "kind required"],
    enum: ["متعاقد", "سوق محلى"],
  },

  address: {
    type: String,
    required: [true, "address required"],
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
