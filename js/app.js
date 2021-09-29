const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

class Citas {
    constructor(){
        this.citas = [];
    }
    agregarCita(cita){
        this.citas = [...this.citas, cita];
        console.log(this.citas);
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        divMensaje.textContent = mensaje;

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
        
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        
        setTimeout(() => {
            divMensaje.remove();
        }, 4000)
    }
}

const ui = new UI();
const administradorCitas = new Citas();

eventListeners();
function eventListeners() {
    mascotaInput.addEventListener('input', datosCita);
    propietarioInput.addEventListener('input', datosCita);
    telefonoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

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
    const {name, value} = e.target;
    citaObj[name] = value;
}

function validarFormulario(e){
    e.preventDefault();
    
    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    if(!mascota || !propietario || !telefono || !fecha || !hora || !sintomas){
        
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
    
    citaObj.id = Date.now();
    administradorCitas.agregarCita({...citaObj});
    
    reiniciarObjetoCita();
    formulario.reset();
}

function reiniciarObjetoCita() {
    for(prop in citaObj){
        citaObj[prop] = '';
    }
}