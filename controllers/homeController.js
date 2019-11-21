const Vacante = require('../models/Vacantes');

module.exports = {
    mostrarTrabajos: async (req, res, next) => {
        const vacantes = await Vacante.find();

        if (!vacantes) return next();

        res.render('home', {
            pageName: 'devJobs',
            tagline: 'Encuentra y pública trabajos para desarrolladores web.',
            barra: true,
            boton: true,
            vacantes
        });
    }
}