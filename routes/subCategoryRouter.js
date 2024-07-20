const express=require('express');
const authController=require('../controllers/authController')
const subCategoryController=require('../controllers/subCategoryController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createsubCategory',subCategoryController.uploadsubCategoryPhoto,subCategoryController.createsubCategory),
router.get('/getsubCategorys',subCategoryController.getsubCategorys)
router.patch('/updatesubCategory/:id',subCategoryController.uploadsubCategoryPhoto,subCategoryController.resizesubCategoryPhoto,subCategoryController.updatesubCategory)
router.delete('/deletesubCategory/:id',subCategoryController.deletesubCategory)
router.get('/search/:term',subCategoryController.searchsubCategory)


module.exports=router;




