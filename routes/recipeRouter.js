const express=require('express');
const authController=require('../controllers/authController')
const recipeController=require('../controllers/recipeController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createrecipe',recipeController.uploadrecipePhoto,recipeController.createrecipe),
router.get('/getrecipes',recipeController.getrecipes)
router.patch('/updaterecipe/:id',recipeController.uploadrecipePhoto,recipeController.resizerecipePhoto,recipeController.updaterecipe)
router.delete('/deleterecipe/:id',recipeController.deleterecipe)
router.get('/search/:term',recipeController.searchrecipe)


module.exports=router;




