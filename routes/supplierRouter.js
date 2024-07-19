const express=require('express');
const supplierController=require('../controllers/supplierController')
const authController=require('../controllers/authController')
const router = express.Router();

//TODO:admin permission
router.use(authController.protect)
router.post('/createSupplier',supplierController.createSupplier);
router.get('/getSuppliers',supplierController.getSuppliers)
router.patch('/updateSupplier/:id',supplierController.updateSupplier)
router.get('/search/:term',supplierController.searchSupplier)
router.delete('/deleteSupplier/:id',supplierController.deleteSupplier)
module.exports=router;