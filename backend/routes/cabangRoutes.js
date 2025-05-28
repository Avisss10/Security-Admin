// routes/cabangRoutes.js
const express = require('express');
const router = express.Router();
const cabangController = require('../controllers/cabangController');

router.get('/', cabangController.getAllCabang);
router.get('/:id', cabangController.getCabangById);
router.post('/', cabangController.createCabang);
router.put('/:id', cabangController.updateCabang);
router.delete('/:id', cabangController.deleteCabang);

module.exports = router;
