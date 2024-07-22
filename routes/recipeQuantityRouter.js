const express=require('express');
const authController=require('../controllers/authController')
const recipeQuantityController=require('../controllers/recipeQuantityController')
const router = express.Router();

router.use(authController.protect)
router.post('/create',recipeQuantityController.create)
router.get('/getRecipesQuantity',recipeQuantityController.getRecipesQuantity)
router.get('/getOneRecipesQuantity',recipeQuantityController.getOneRecipesQuantity)
router.patch('/updateRecipe/:id',recipeQuantityController.updateRecipeQuantity)
router.delete('/deleteRecipe/:id',recipeQuantityController.deleteRecipeQuantity)

module.exports=router;
