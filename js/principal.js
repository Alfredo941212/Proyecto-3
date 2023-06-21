const pacienteInput = document.querySelector('#paciente')
const telefonoPacienteInput = document.querySelector('#telefonoPaciente')
const contactoInput = document.querySelector('#contacto')
const telefonoContactoInput = document.querySelector('#telefonoContacto')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')

const formulario = document.querySelector('#formula')
const contenedorCitas = document.querySelector('#citas')

let editando;

class Citas{
    constructor(){
        this.citas = [];
    }

    agregarCita(cita){
        this.citas = [...this.citas, cita]
        
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }
    editarCita(citaActualizada){
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI{
    
    imprimirAlerta(mensaje, tipo){
        //Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.style.textAlign = 'center';
        divMensaje.style.height = '20px'
        divMensaje.style.padding = '10px'

        if(tipo === 'error'){
            divMensaje.style.backgroundColor = 'red'
        }else{
            divMensaje.style.backgroundColor = 'green'
        }

        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Agregar al DOM
        document.querySelector('main').insertBefore(divMensaje, document.querySelector('.container'))

        setTimeout(() =>{
            divMensaje.remove()
        }, 3000)
    }

    imprimirCitas({citas}){

        this.limpiarHTML();

        citas.forEach(cita => {
            const {paciente, telefonoPaciente, contacto, telefonoContacto, fecha, hora, sintomas,id} = cita;

            const divCita = document.createElement('div');
            divCita.style.fontSize = 'large'
            divCita.dataset.id = id;


            const pacienteParrafo = document.createElement('p');
            pacienteParrafo.style.fontWeight = '100'
            pacienteParrafo.textContent = paciente;

            const panumeroParrafo = document.createElement('p');
            panumeroParrafo.innerHTML = `
                <span> Telefono de paciente: </span> ${telefonoPaciente}
            `;

            const contactoParrafo = document.createElement('p');
            contactoParrafo.innerHTML = `
                <span> Contacto: </span> ${contacto}
            `;

            const conumeroParrafo = document.createElement('p');
            conumeroParrafo.innerHTML = `
                <span> Telefono del contacto: </span> ${telefonoContacto}
            `;

            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML = `
                <span> Telefono de paciente: </span> ${fecha}
            `;

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML = `
                <span> Telefono de paciente: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML = `
                <span> Telefono de paciente: </span> ${sintomas}
            `;

            //Boton para eliminar cita
            const btnEliminar = document.createElement('button')
            btnEliminar.style.backgroundColor = 'red'
            btnEliminar.style.width = '5rem'
            btnEliminar.style.border = 'none'
            btnEliminar.style.height = '3rem'
            btnEliminar.style.fontFamily = 'Arial, Helvetica, sans-serif'
            btnEliminar.innerHTML = 'Eliminar' 

            btnEliminar.onclick = () => eliminarCita(id);

            //boton para modificar cita
            const btnEditar = document.createElement('button')
            btnEditar.style.backgroundColor = 'yellow'
            btnEditar.style.width = '5rem'
            btnEditar.style.border = 'none'
            btnEditar.style.height = '3rem'
            btnEditar.style.fontFamily = 'Arial, Helvetica, sans-serif'
            btnEditar.innerHTML = 'Editar' 
            btnEditar.style.gap = '2rem'

            btnEditar.onclick = () => cargarEdicion(cita);


            //Agregar los parrafos al divcita
            divCita.appendChild(pacienteParrafo)
            divCita.appendChild(panumeroParrafo)
            divCita.appendChild(contactoParrafo)
            divCita.appendChild(conumeroParrafo)
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            //agregar las citas al HTML
            contenedorCitas.appendChild(divCita)

        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI(); //Intancias
const administrarCitas = new Citas(); //Instancias

eventListener()
function eventListener(params) {
    pacienteInput.addEventListener('input', datosCita);
    telefonoPacienteInput.addEventListener('input', datosCita);
    contactoInput.addEventListener('input', datosCita);
    telefonoContactoInput.addEventListener('input', datosCita);
    fechaInput.addEventListener('input', datosCita);
    horaInput.addEventListener('input', datosCita);
    sintomasInput.addEventListener('input', datosCita);

    formulario.addEventListener('submit', nuevaCita);
}

const citaObj = {
    paciente: '',
    telefonoPaciente: '',
    contacto: '',
    telefonoContacto: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

//Agrega datos al objeto de cita
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

//Validar y agreagr una nueva cita a la clase de citas
function nuevaCita(e) {
    e.preventDefault();

    //Extraer la informacion del objeto de cita
    const {paciente, telefonoPaciente, contacto, telefonoContacto, fecha, hora, sintomas} = citaObj;

    //Validar
    if(paciente ==='' || telefonoPaciente ==='' || contacto === '' || telefonoContacto === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')

        return;
    }

    if(editando){
        ui.imprimirAlerta('Editado correctamente');

        administrarCitas.editarCita({...citaObj})

        formulario.querySelector('button ').textContent = 'Crear cita';

        editando = false;
    }else{
        //generar un ID único
        citaObj.id = Date.now()
        //Creando una nueva cita
        administrarCitas.agregarCita({...citaObj})

        ui.imprimirAlerta('Se agregó correctamente')
    }



    //Reiniciar el objeto para la validación
    reiniciarObjeto();

    //Reinicia el formulario
    formulario.reset()


    ui.imprimirCitas(administrarCitas);
}


//Reiniciando el objeto
function reiniciarObjeto(){
    citaObj.paciente = '';
    citaObj.telefonoPaciente = '';
    citaObj.contacto = '';
    citaObj.telefonoContacto = '';
    citaObj.fecha = '';
    citaObj.hora = '';
    citaObj.sintomas = '';
}

function eliminarCita(id) {
    administrarCitas.eliminarCita(id);

    ui.imprimirAlerta('La cita se eliminó correctamente')

    ui.imprimirCitas(administrarCitas);
}

//Carga los datos y el modo edición

function cargarEdicion(cita){
    const {paciente, telefonoPaciente, contacto, telefonoContacto, fecha, hora, sintomas, id} = cita;

    //Lenar los inputs
    pacienteInput.value = paciente;
    telefonoPacienteInput.value = telefonoPaciente;
    contactoInput.value = contacto;
    telefonoContactoInput.value = telefonoContacto;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;
    
    //Lenando el objeto
    citaObj.paciente = paciente;
    citaObj.telefonoPaciente = telefonoPaciente;
    citaObj.contacto = contacto;
    citaObj.telefonoContacto = telefonoContacto;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Cambiar el texto del boton
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';


    editando = true;
}