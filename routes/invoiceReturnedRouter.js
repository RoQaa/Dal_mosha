const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/invoiceReturnedController')
const router = express.Router();


router.use(authController.protect)
router.post('/createReturnedInvoice',invoiceController.uploadInvoicePhoto,invoiceController.createReturnedInvoice),
router.post('/confirmOrRefuseReturnedInvoice/:id',invoiceController.confirmOrRefuseReturnedInvoice)



module.exports=router;




