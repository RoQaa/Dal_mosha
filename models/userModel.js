const mongoose=require('mongoose')
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please Enter your User Name'] ,
       // unique:[true,"there's a user with that name "],
        //trim:true
    },
    username:{
      type:String,
      unique:[true,'هذا الاسم متسخدم بالفعل'],
      required:[true,"يجب ادخال اسم الحساب"]
    },
    phone:{
      type:String,
      required:[true,"phone required"]
    },
    role:{
        type:String,
        enum:['cashier','admin','kitchen'],
        default:'cashier'
    },
    password: {
        type: String,
        required: [true, 'Please Enter your Password'],
        trim: true,
        minlength: [8, ' Password At least has 8 charachters'],
        select: false, // make it invisible when get all users
      },
      
      profileImage:{
        type:String,
        //TODO: DEFAULT
      },
      isActive:{
        type:Boolean,
        default:true
      },
      inventory:{
        type:mongoose.Schema.ObjectId,
        ref:"Inventory",
        required:"must have In Inventory"
    },
      passwordChangedAt: Date,

},
{
  timestamps:true
} /*{
    //timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }*/)
  userSchema.index({ name: 'text'});
  // DOCUMENT MIDDLEWARE

  userSchema.pre('save', async function (next) {
    //only run if password modified
    if (!this.isModified('password')) {
      return next();
    }
    //hash password
    this.password = await bcrypt.hash(this.password, 12);
    
    next();
  });



  userSchema.pre(/^find/, function (next) {
    this.find({ isActive: { $ne: false } }).select('-createdAt -rating');
    next();
  });
  


  //instance method check password login
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
  ) {
 
    return await bcrypt.compare(candidatePassword, userPassword); // compare bt3mal hash le candidate we btcompare b3deha
  };

  
userSchema.methods.changesPasswordAfter = function (JWTTimestamps) {
    if (this.passwordChangedAt) {
      const changedTimestamps = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      ); //=> 10 min
      //console.log(changedTimestamps,JWTTimestamps);
      return JWTTimestamps < changedTimestamps;
    }
    return false;
  };




  const User = mongoose.model('User',userSchema);
  module.exports=User;