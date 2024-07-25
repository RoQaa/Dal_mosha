const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/InvoiceSupplierController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createSupplierInvoice',invoiceController.uploadInvoicePhoto,invoiceController.createSupplierInvoice),
router.post('/confirmOrRefuseSupplierInvoice/:id',invoiceController.confirmOrRefuseSupplierInvoice)



module.exports=router;




