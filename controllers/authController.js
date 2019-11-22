const passport = require('passport');

module.exports = {
    autenticarUsuario: passport.authenticate('local', {
        successRedirect: '/administracion',
        failureRedirect: '/iniciar-sesion',
        failureFlash: true,
        badRequestMessage: 'Ambos campos son obligatorios'
    })
}