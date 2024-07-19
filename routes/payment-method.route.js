const express = require('express');
const authController = require('../controllers/authController')
const PaymentMethodController = require('../controllers/payment-method.controller')

const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)

router.post('/add', PaymentMethodController.addPaymentMethod);
router.get('/:id', PaymentMethodController.getPaymentMethod)
router.get('', PaymentMethodController.getAllPaymentMethods)
router.put('/:id', PaymentMethodController.updatePaymentMethod)
router.delete('/:id', PaymentMethodController.deletePaymentMethod)

module.exports = router;




