const express=require('express');
const authController=require('../controllers/authController')
const IngradientController=require('../controllers/ingradientController')
const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)
router.post('/createIngradient',IngradientController.uploadIngradientPhoto,IngradientController.createIngradient),
router.get('/getIngradients',IngradientController.getIngradients)
router.patch('/updateIngradient/:id',IngradientController.uploadIngradientPhoto,IngradientController.resizeIngradientPhoto,IngradientController.updateIngradient)
router.delete('/deleteIngradient/:id',IngradientController.deleteIngradient)
router.get('/search/:term',IngradientController.searchIngradient)


module.exports=router;




