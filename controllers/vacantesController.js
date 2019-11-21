const Vacante = require('../models/Vacantes');

module.exports = {
    formularioNuevaVacante: (req, res) => {
        res.render('nueva-vacante', {
            pageName: 'Nueva vacante',
            tagline: 'Llena el formulario y publica tu vacante.'
        })
    },
    agregarVacante: async (req, res) => {
        const vacante = new Vacante(req.body);
        
        vacante.skills = req.body.skills.split(',');

        const nuevaVacante = await vacante.save();
        
        res.redirect(`/vacantes/${nuevaVacante.url}`);
    }
}