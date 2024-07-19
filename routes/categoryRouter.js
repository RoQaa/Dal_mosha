const express=require('express');
const authController=require('../controllers/authController')
const CategoryController=require('../controllers/categoryController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createCategory',CategoryController.uploadCategoryPhoto,CategoryController.createCategory),
router.get('/getCategorys',CategoryController.getCategorys)
router.patch('/updateCategory/:id',CategoryController.uploadCategoryPhoto,CategoryController.resizeCategoryPhoto,CategoryController.updateCategory)
router.delete('/deleteCategory/:id',CategoryController.deleteCategory)
router.get('/search/:term',CategoryController.searchCategory)


module.exports=router;




