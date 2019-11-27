const express = require('express');
const { check, sanitizeBody } = require('express-validator');

const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', homeController.mostrarTrabajos);

router.get('/vacantes/nueva', authController.verificarUsuario, vacantesController.formularioNuevaVacante);
router.post('/vacantes/nueva',
    authController.verificarUsuario,
    [
        sanitizeBody('titulo').escape(),
        sanitizeBody('empresa').escape(),
        sanitizeBody('ubicacion').escape(),
        sanitizeBody('salario').escape(),
        sanitizeBody('contrato').escape(),
        sanitizeBody('skills').escape(),
        check('titulo').not().isEmpty().withMessage('Agrega un titulo a la vacante'),
        check('empresa').not().isEmpty().withMessage('Agrega una empresa'),
        check('ubicacion').not().isEmpty().withMessage('Agrega una ubicación'),
        check('contrato').not().isEmpty().withMessage('Selecciona el tipo de vacante'),
        check('skills').not().isEmpty().withMessage('Agrega almenos una habilidad'),
    ],
    vacantesController.validarVacante,
    vacantesController.agregarVacante
);
router.get('/vacantes/:url', vacantesController.mostrarVacante);
router.get('/vacantes/editar/:url', authController.verificarUsuario, vacantesController.formEditarVacante);
router.post('/vacantes/editar/:url',
    authController.verificarUsuario,
    [
        sanitizeBody('titulo').escape(),
        sanitizeBody('empresa').escape(),
        sanitizeBody('ubicacion').escape(),
        sanitizeBody('salario').escape(),
        sanitizeBody('contrato').escape(),
        sanitizeBody('skills').escape(),
        check('titulo').not().isEmpty().withMessage('Agrega un titulo a la vacante'),
        check('empresa').not().isEmpty().withMessage('Agrega una empresa'),
        check('ubicacion').not().isEmpty().withMessage('Agrega una ubicación'),
        check('contrato').not().isEmpty().withMessage('Selecciona el tipo de vacante'),
        check('skills').not().isEmpty().withMessage('Agrega almenos una habilidad'),
    ],
    vacantesController.validarVacante,
    vacantesController.editarVacante
);
router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante);

router.get('/crear-cuenta', usuariosController.formCrearCuenta);
router.post('/crear-cuenta',
    [
        sanitizeBody('nombre').escape(),
        sanitizeBody('email').escape(),
        sanitizeBody('password').escape(),
        sanitizeBody('confirmar').escape(),
        check('nombre').not().isEmpty().withMessage('El nombre es obligatorio.'),
        check('email').isEmail().withMessage('El email es obligatorio.'),
        check('password').not().isEmpty().withMessage('El password no puede ir vacio.'),
        check('confirmar').not().isEmpty().withMessage('Confirmar password, no puede ir vacio.'),
    ],
    usuariosController.validarRegistro,
    usuariosController.crearCuenta
);

router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
router.post('/iniciar-sesion', authController.autenticarUsuario);
router.get('/cerrar-sesion', authController.verificarUsuario, authController.cerrarSesion);

router.get('/administracion', authController.verificarUsuario, authController.mostrarPanel);

router.get('/editar-perfil', authController.verificarUsuario, usuariosController.formEditarPerfil);
router.post('/editar-perfil',
    authController.verificarUsuario,
    [
        sanitizeBody('nombre').escape(),
        sanitizeBody('email').escape(),
        check('nombre').not().isEmpty().withMessage('El nombre no puede ir vacio'),
        check('email').not().isEmpty().withMessage('El email no puede ir vacio'),
    ],
    usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil
);

router.post('/vacantes/:url', vacantesController.subirCV, vacantesController.contactar);

router.get('/candidatos/:id', authController.verificarUsuario, vacantesController.mostrarCandidatos);

module.exports = router;