const express = require('express');
const authController = require('../controllers/authController')
const SellingPointController = require('../controllers/placesController')
const {uploadSellingPointPhoto} = require("../controllers/placesController");
const {resizeCategoryPhoto} = require("../controllers/categoryController");

const router = express.Router();
//TODO:admin permissions

router.use(authController.protect)

router.post('/add', uploadSellingPointPhoto, SellingPointController.addPlace);
router.get('/:id', SellingPointController.getPlace)
router.get('', SellingPointController.getAllPlaces)
router.put('/:id', uploadSellingPointPhoto, resizeCategoryPhoto, SellingPointController.updatePlace)
router.delete('/:id', SellingPointController.deletePlace)

module.exports = router;




