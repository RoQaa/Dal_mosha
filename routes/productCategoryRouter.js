const express = require('express');
const authController = require('../controllers/authController')
const ProductCategoryController = require('../controllers/productCategoryController')
const {uploadSellingPointPhoto, resizeCategoryPhoto} = require('../controllers/productCategoryController');

const router = express.Router();

//TODO:admin permissions

router.use(authController.protect)

router.post('/add', uploadSellingPointPhoto, ProductCategoryController.addProductSubCategory);
router.get('/:id', ProductCategoryController.getProductSubCategory)
router.get('', ProductCategoryController.getAllProductSubCategory)
router.put('/:id', uploadSellingPointPhoto, resizeCategoryPhoto, ProductCategoryController.updateProductSubCategory)
router.delete('/:id', ProductCategoryController.deleteProductSubCategory)

module.exports = router;




