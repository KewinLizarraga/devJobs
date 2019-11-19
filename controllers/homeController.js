module.exports = {
    mostrarTrabajos: (req, res, next) => {
        res.render('home', {
            pageName: 'devJobs',
            tagline: 'Encuentra y pública trabajos para desarrolladores web.',
            barra: true,
            boton: true
        });
    }
}