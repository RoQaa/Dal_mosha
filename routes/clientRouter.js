const express = require('express');
const authController = require('../controllers/authController')
const ClientController = require('../controllers/clientController')

const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)

router.post('/add', ClientController.addClient);
router.get('/:id', ClientController.getClient)
router.get('', ClientController.getAllClients)
router.put('/:id', ClientController.updateClient)
router.delete('/:id', ClientController.deleteClient)

module.exports = router;




