import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');
    let alertas = document.querySelector('.alertas');   // Clean alerts

    if (alertas) limpiarAlertas();

    if (skills) {
        skills.addEventListener('click', agregarSkills);
        skillsSeleccionados();      // When we are in edit, we call this function
    }

    const vacanteListado = document.querySelector('.panel-administracion');
    if (vacanteListado) vacanteListado.addEventListener('click', accionesListado);
});

const skills = new Set();
const agregarSkills = (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            skills.delete(e.target.textContent);    // remove SET and CLASS
            e.target.classList.remove('activo');
        } else {
            skills.add(e.target.textContent);       // add el SET y la CLASS
            e.target.classList.add('activo');
        }
    }
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    });

    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);
}

const accionesListado = (e) => {
    e.preventDefault();
    if (e.target.dataset.eliminar) {
        Swal.fire({
            title: 'Confirmar eliminación?',
            text: "Una vez eliminado, no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.value) {
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                axios.delete(url, { params: { url } }).then(function (respuesta) {
                    if (respuesta.status === 200) {
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        );
                        e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                    }
                }).catch(() => {
                    Swal.fire({
                        type: 'error',
                        title: 'Hubo un error',
                        text: 'No se pudo eliminar'
                    });
                });
            }
        })
    } else if (e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
}