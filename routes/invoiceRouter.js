const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/InvoiceController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.put('/createinvoice',invoiceController.uploadInvoicePhoto,invoiceController.createInvoice),
router.get('/getinvoices',invoiceController.getInvoices)
router.patch('/updateinvoice/:id',invoiceController.uploadInvoicePhoto,invoiceController.resizeInvoicePhoto,invoiceController.updateInvoice)
router.delete('/deleteinvoice/:id',invoiceController.deleteInvoice)
router.get('/search/:term',invoiceController.searchInvoice)


module.exports=router;




