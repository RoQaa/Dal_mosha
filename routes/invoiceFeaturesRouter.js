const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/invoiceFeaturesController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.get('/getInvoices/:kind',invoiceController.getInvoices)
router.get('/searchByCodeInvoice',invoiceController.searchByCodeInvoice)
router.post('/searchInvoiceByDate',invoiceController.searchInvoiceByDate)
router.post('/searchInvoiceByStatus',invoiceController.searchInvoiceByStatus)
module.exports=router;




