const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/InvoiceController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createSupplierInvoice',invoiceController.uploadInvoicePhoto,invoiceController.createSupplierInvoice),
router.get('/getinvoices',invoiceController.getInvoices)
router.patch('/updateinvoice/:id',invoiceController.uploadInvoicePhoto,invoiceController.resizeInvoicePhoto,invoiceController.updateInvoice)
router.delete('/deleteinvoice/:id',invoiceController.deleteInvoice)
router.get('/search/:term',invoiceController.searchInvoice)
router.post('/searchByDate',invoiceController.searchInvoiceByDate)

module.exports=router;




