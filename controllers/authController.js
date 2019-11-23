const passport = require('passport');
const Vacante = require('../models/Vacantes');

module.exports = {
    autenticarUsuario: passport.authenticate('local', {
        successRedirect: '/administracion',
        failureRedirect: '/iniciar-sesion',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son obligatorios'
    }),
    verificarUsuario: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/iniciar-sesion');
    },
    mostrarPanel: async (req, res) => {
        const vacantes = await Vacante.find({ autor: req.user._id });

        res.render('administracion', {
            pageName: 'Panel de administración',
            tagline: 'Crea y administra tus vacantes desde aquí',
            cerrarSesion: true,
            nombre: req.user.nombre,
            vacantes
        });
    },
    cerrarSesion: (req ,res) => {
        req.logout();
        req.flash('correcto', 'Cerraste sesión correctamente');
        return res.redirect('/iniciar-sesion');
    }
}