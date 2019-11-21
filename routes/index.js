const express = require('express');
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');

const router = express.Router();

router.get('/', homeController.mostrarTrabajos);

router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
router.post('/vacantes/nueva', vacantesController.agregarVacante);

router.get('/vacantes/:url', vacantesController.mostrarVacante);

module.exports = router;