const express = require('express');
const authController = require('../controllers/authController')
const ProductCategoryController = require('../controllers/productCategoryController')
const {uploadSellingPointPhoto, resizeCategoryPhoto} = require('../controllers/productCategoryController');

const router = express.Router();

//TODO:admin permissions

router.use(authController.protect)

router.post('/add', uploadSellingPointPhoto, ProductCategoryController.addProductRecipe);
router.get('/:id', ProductCategoryController.getProductRecipe)
router.get('', ProductCategoryController.getAllProductRecipe)
router.put('/:id', uploadSellingPointPhoto, resizeCategoryPhoto, ProductCategoryController.updateProductRecipe)
router.delete('/:id', ProductCategoryController.deleteProductRecipe)

module.exports = router;




