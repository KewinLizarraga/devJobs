const passport = require('passport');
const crypto = require('crypto');
const Vacante = require('../models/Vacantes');
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

module.exports = {
    autenticarUsuario: passport.authenticate('local', {
        successRedirect: '/administracion',
        failureRedirect: '/iniciar-sesion',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son obligatorios'
    }),
    verificarUsuario: (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/iniciar-sesion');
    },
    mostrarPanel: async (req, res) => {
        const vacantes = await Vacante.find({ autor: req.user._id });

        res.render('administracion', {
            pageName: 'Panel de administración',
            tagline: 'Crea y administra tus vacantes desde aquí',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
            vacantes
        });
    },
    cerrarSesion: (req, res) => {
        req.logout();
        req.flash('correcto', 'Cerraste sesión correctamente');
        return res.redirect('/iniciar-sesion');
    },
    formReestablecerPassword: (req, res) => {
        res.render('reestablecer-password', {
            pageName: 'Reestablece tu password',
            tagline: 'Si ya tienes una cuenta, per olvidaste tu password, coloca tu email'
        });
    },
    enviarToken: async (req, res) => {
        const usuario = await Usuarios.findOne({ email: req.body.email });

        if (!usuario) {
            req.flash('error', 'No existe es cuenta');
            return res.redirect('/iniciar-sesion');
        }

        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expira = Date.now() + 3600000;

        await usuario.save();
        const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'reset'
        });

        req.flash('correcto', 'Revisa tu e-mail para las indicaciones');
        res.redirect('/iniciar-sesion');
    },
    reestablecerPassword: async (req, res) => {
        const usuario = await Usuarios.findOne({
            token: req.params.token,
            expira: {
                $gt: Date.now()
            }
        });

        if (!usuario) {
            req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
            return res.redirect('/reestablecer-password');
        }

        res.render('nuevo-password', {
            pageName: 'Nuevo Password'
        });
    },
    guardarPassword: async (req, res) => {
        const usuario = await Usuarios.findOne({
            token: req.params.token,
            expira: {
                $gt: Date.now()
            }
        });
        
        if(!usuario) {
            req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
            return res.redirect('/reestablecer-password');
        }
    
        usuario.password = req.body.password;
        usuario.token = undefined;
        usuario.expira = undefined;
    
        await usuario.save();
    
        req.flash('correcto', 'Password Modificado Correctamente');
        res.redirect('/iniciar-sesion');
    }
}