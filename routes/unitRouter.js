const express=require('express');
const unitController=require('../controllers/unitController')
const router = express.Router();
router.post('/createUnit',unitController.createUnit)
router.get('/getUnits',unitController.getUnits)
router.patch('/updateUnit/:id',unitController.updateUnit)
router.delete('/deleteUnit/:id',unitController.deleteUnit)



module.exports=router;