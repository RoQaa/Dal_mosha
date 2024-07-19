const mongoose=require('mongoose')
const permissionSchema = new mongoose.Schema({

})


const Permission=mongoose.model('Permission',permissionSchema)
module.exports=Permission;