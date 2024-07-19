const express = require('express');
const authController = require('../controllers/authController')
const SellingPointController = require('../controllers/selling-points.controller')
const {uploadSellingPointPhoto} = require("../controllers/selling-points.controller");
const {resizeCategoryPhoto} = require("../controllers/categoryController");

const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)

router.post('/add', uploadSellingPointPhoto, SellingPointController.addSellingPoint);
router.get('/:id', SellingPointController.getSellingPoint)
router.get('', SellingPointController.getAllSellingPoints)
router.put('/:id', uploadSellingPointPhoto, resizeCategoryPhoto, SellingPointController.updateSellingPoint)
router.delete('/:id', SellingPointController.deleteSellingPoint)

module.exports = router;




