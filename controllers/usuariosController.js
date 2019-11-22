const { check, sanitizeBody, validationResult } = require('express-validator');


const Usuario = require('../models/Usuarios');

module.exports = {
    formCrearCuenta: (req, res) => {
        res.render('crear-cuenta', {
            pageName: 'Crear tu cuenta en DevJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
        });
    },
    validarRegistro: async (req, res, next) => {
        if (req.body.password) {
            await check('confirmar').equals(req.body.password).withMessage('El password es diferente').run(req);
        }

        const errores = validationResult(req);
        // Si hay errores
        if (!errores.isEmpty()) {
            let err = errores.errors;
            // return console.log('Error(IF):', err);

            req.flash('error', err.map(error => error.msg));

            res.render('crear-cuenta', {
                pageName: 'Crear tu cuenta en DevJobs',
                tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
                mensajes: req.flash()
            });
            return;
        }
        // Si toda la validación es correcta

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
}