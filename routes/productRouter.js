const express = require('express');
const authController = require('../controllers/authController')
const Product = require('../controllers/productController')
const {uploadSellingPointPhoto, resizeCategoryPhoto} = require('../controllers/productController');

const router = express.Router();

//TODO:admin permissions

router.use(authController.protect)

router.post('/add', uploadSellingPointPhoto, Product.addProduct);
router.get('/:id', Product.getProduct)
router.get('', Product.getAllProducts)
router.put('/:id', uploadSellingPointPhoto, resizeCategoryPhoto, Product.updateProduct)
router.delete('/:id', Product.deleteProduct)

module.exports = router;




