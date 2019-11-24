const { check, validationResult } = require('express-validator');
const Vacante = require('../models/Vacantes');

module.exports = {
    formularioNuevaVacante: (req, res) => {
        res.render('nueva-vacante', {
            pageName: 'Nueva vacante',
            tagline: 'Llena el formulario y publica tu vacante.',
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
        })
    },
    agregarVacante: async (req, res) => {
        const vacante = new Vacante(req.body);

        vacante.autor = req.user._id;
        vacante.skills = req.body.skills.split(',');

        const nuevaVacante = await vacante.save();

        res.redirect(`/vacantes/${nuevaVacante.url}`);
    },
    mostrarVacante: async (req, res, next) => {
        const vacante = await Vacante.findOne({ url: req.params.url }).populate('autor');

        if (!vacante) return next();

        res.render('vacante', {
            vacante,
            pageName: vacante.titulo,
            barra: true
        });
    },
    formEditarVacante: async (req, res, next) => {
        const vacante = await Vacante.findOne({ url: req.params.url });

        if (!vacante) return next();

        res.render('editar-vacante', {
            vacante,
            pageName: `Editar - ${vacante.titulo}`,
            cerrarSesion: true,
            nombre: req.user.nombre,
            imagen: req.user.imagen,
        });
    },
    editarVacante: async (req, res, next) => {
        const vacanteActualizada = req.body;

        vacanteActualizada.skills = req.body.skills.split(',');

        const vacante = await Vacante.findOneAndUpdate(
            { url: req.params.url },
            vacanteActualizada,
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.redirect(`/vacantes/${vacante.url}`);
    },
    validarVacante: (req, res, next) => {
        const errores = validationResult(req);

        if (!errores.isEmpty()) {
            let err = errores.errors;

            req.flash('error', err.map(error => error.msg));
            res.render('nueva-vacante', {
                pageName: 'Nueva vacante',
                tagline: 'Llena el formulario y publica tu vacante.',
                cerrarSesion: true,
                nombre: req.user.nombre,
                mensajes: req.flash()
            });
            return;
        }
        next()
    },
    eliminarVacante: async (req, res) => {
        const vacante = await Vacante.findById(req.params.id);

        if (verificarAutor(vacante, req.user)) {
            vacante.remove();
            res.status(200).send('Vacante eliminado correctamente');
        } else {
            res.status(403).send('Error');
        }
    }
}

const verificarAutor = (vacante = {}, usuario = {}) => {
    if (!vacante.autor.equals(usuario._id)) return false;
    return true;
}