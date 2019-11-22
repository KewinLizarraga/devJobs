const express = require('express');
const { check, sanitizeBody } = require('express-validator');

const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', homeController.mostrarTrabajos);

router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
router.post('/vacantes/nueva', vacantesController.agregarVacante);

router.get('/vacantes/:url', vacantesController.mostrarVacante);

router.get('/vacantes/editar/:url', vacantesController.formEditarVacante);
router.post('/vacantes/editar/:url', vacantesController.editarVacante);

router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta',
    [
        check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
        check('email').isEmail().withMessage('El email es obligatorio.'),
        check('password').not().isEmpty().withMessage('El password no puede ir vacio.'),
        check('confirmar').not().isEmpty().withMessage('Confirmar password, no puede ir vacio.'),
        sanitizeBody('nombre').escape(),
        sanitizeBody('email').escape(),
        sanitizeBody('password').escape(),
        sanitizeBody('confirmar').escape(),
    ],
    usuariosController.validarRegistro,
    usuariosController.crearCuenta
);

module.exports = router;