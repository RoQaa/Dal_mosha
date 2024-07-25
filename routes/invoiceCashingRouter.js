const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/invoiceCashingController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createCashingInvoice',invoiceController.uploadInvoicePhoto,invoiceController.createCashingInvoice),
router.post('/confirmOrRefuseCashingInvoice/:id',invoiceController.confirmOrRefuseCashingInvoice)



module.exports=router;




