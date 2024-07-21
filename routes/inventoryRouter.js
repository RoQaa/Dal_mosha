const express =require('express')
const authController=require('../controllers/authController')
const inventoryController=require('../controllers/inventoryController')
const router=express.Router();

router.use(authController.protect)
router.post('/createInventory',inventoryController.createInventory)
router.get('/getInventories',inventoryController.getInventories)
router.get('/getOneInventory/:id',inventoryController.getOneInventory)

router.patch('/updateInventory/:id',inventoryController.updateInventory)
router.delete('/deleteInventory/:id',inventoryController.deleteInventory)

module.exports=router