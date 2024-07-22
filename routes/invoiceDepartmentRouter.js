const express=require('express');
const authController=require('../controllers/authController')
const invoiceController=require('../controllers/invoiceDepartmentController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createinvoiceDepartment',invoiceController.createInvoice),
router.get('/getinvoiceDepartment',invoiceController.getInvoices)
router.delete('/deleteinvoiceDepartment/:id',invoiceController.deleteInvoice)
router.get('/search/:term',invoiceController.searchInvoice)
router.post('/searchByDate',invoiceController.searchInvoiceByDate)

module.exports=router;




