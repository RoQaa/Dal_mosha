const express = require('express');
const authController = require('../controllers/authController')
const ClientTypeController = require('../controllers/client-type.controller')

const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)

router.post('/add', ClientTypeController.addClientType);
router.get('/:id', ClientTypeController.getClientType)
router.get('', ClientTypeController.getAllClientTypes)
router.put('/:id', ClientTypeController.updateClientType)
router.delete('/:id', ClientTypeController.deleteClientType)

module.exports = router;




