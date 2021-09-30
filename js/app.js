const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

class Citas {
    constructor() {
        this.citas = [];
    }
    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
    editarCita(citaActualizada) {
        this.citas = this.citas.map( cita => citaActualizada.id === cita.id ? citaActualizada : cita);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        divMensaje.textContent = mensaje;

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divMensaje.remove();
        }, 4000)
    }
    imprimirCitas({ citas }) { // Destructuring de objetos desde parametros
        this.limpiarHTML();

        citas.forEach(cita => {
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('h2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML = `
                <span class"font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML = `
                <span class"font-weight-bolder">Teléfono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span class"font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span class"font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span class"font-weight-bolder">Síntomas: </span> ${sintomas}
            `;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.innerHTML = 'Eliminar &times';

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info', 'mr-2');
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';

            btnEliminar.onclick = () => eliminarCita(id);
            btnEditar.onclick = () => cargarEdicion(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            contenedorCitas.appendChild(divCita);
        })
    }

    limpiarHTML() {
        while (contenedorCitas.hasChildNodes()) {
            contenedorCitas.firstChild.remove();
        }
    }
}

const ui = new UI();
const administradorCitas = new Citas();

eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('blur', datosCita);
    propietarioInput.addEventListener('blur', datosCita);
    telefonoInput.addEventListener('blur', datosCita);
    fechaInput.addEventListener('blur', datosCita);
    horaInput.addEventListener('blur', datosCita);
    sintomasInput.addEventListener('blur', datosCita);

    formulario.addEventListener('submit', validarFormulario);
}

const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

function datosCita(e) {
    const { name, value } = e.target;
    citaObj[name] = value;
}

function validarFormulario(e) {
    e.preventDefault();

    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

    if (!mascota || !propietario || !telefono || !fecha || !hora || !sintomas) {

        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    if (editando) {
        ui.imprimirAlerta('Se edito correctamente');
        administradorCitas.editarCita({...citaObj});
        editando = false;
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';
    } else {
        citaObj.id = Date.now();
        administradorCitas.agregarCita({ ...citaObj });
        ui.imprimirAlerta('Se agrego correctamente');
    }

    reiniciarObjetoCita();
    formulario.reset();
    ui.imprimirCitas(administradorCitas);
}

function reiniciarObjetoCita() {
    for (prop in citaObj) {
        citaObj[prop] = '';
    }
}

function eliminarCita(id) {
    administradorCitas.eliminarCita(id);
    ui.imprimirAlerta('La cita se elimino correctamente');
    ui.imprimirCitas(administradorCitas);
}

function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    // Llenando los input
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id

    // Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';
    editando = true;
}