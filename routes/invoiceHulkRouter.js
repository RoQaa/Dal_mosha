const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/invoiceHulkController')
const router = express.Router();


router.use(authController.protect)
router.post('/createHulkInvoice',invoiceController.uploadInvoicePhoto,invoiceController.createHulkInvoice),
router.post('/confirmOrRefuseHulkInvoice/:id',invoiceController.confirmOrRefuseHulkInvoice)



module.exports=router;




