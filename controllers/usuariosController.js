const { check, validationResult } = require('express-validator');


const Usuario = require('../models/Usuarios');

module.exports = {
    formCrearCuenta: (req, res) => {
        res.render('crear-cuenta', {
            pageName: 'Crear tu cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
        });
    },
    validarRegistro: async (req, res, next) => {
        if (req.body.password) await check('confirmar')
            .equals(req.body.password)
            .withMessage('El password es diferente')
            .run(req);

        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            let err = errores.errors;

            req.flash('error', err.map(error => error.msg));
            res.render('crear-cuenta', {
                pageName: 'Crear tu cuenta en DevJobs',
                tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
                mensajes: req.flash()
            });
            return;
        }
        next();
    },
    crearCuenta: async (req, res, next) => {
        const usuario = new Usuario(req.body);
        try {
            await usuario.save();
            res.redirect('/iniciar-sesion');
        } catch (error) {
            req.flash('error', error);
            res.redirect('/crear-cuenta');
        }
    },
    formIniciarSesion: (req, res) => {
        res.render('iniciar-sesion', {
            pageName: 'Iniciar Sesión - DevJobs'
        });
    },
}