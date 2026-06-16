let personas = [];
let expedientes = [];

async function cargarPersonas(){

    try{

        const response =
            await fetch(
                API_URL + '?sheet=PERSONAS'
            );

        personas =
            await response.json();

        const combo =
            document.getElementById(
                'cmbPersonaResponsable'
            );

        if(!combo) return;

        combo.innerHTML = '';

        personas
        .filter(p => p.Activo === 'Si')
        .forEach(persona => {

            combo.innerHTML += `
    <option
        value="${persona.Nombre}"
        data-actividad="${persona.Actividad}">
        ${persona.Nombre}
    </option>
`;

        });

        actualizarActividadPersona();

    }
    catch(error){

        console.error(error);

    }

}

function actualizarActividadPersona(){

    const combo =
        document.getElementById(
            'cmbPersonaResponsable'
        );

    const actividad =
        combo.options[
            combo.selectedIndex
        ].dataset.actividad;

    document.getElementById(
        'txtActividad'
    ).value = actividad;

}

function abrirModalSalida(){

    cargarPersonas();

    new bootstrap.Modal(
        document.getElementById(
            'modalSalida'
        )
    ).show();

}

document.addEventListener(
    'change',
    function(e){

        if(
            e.target.id ===
            'cmbPersonaResponsable'
        ){

            actualizarActividadPersona();

        }

    }
);

async function guardarSalida(){

    try{

        const expediente = {

            ID: Date.now(),

            NoExpediente:
                document.getElementById(
                    'txtNoExpediente'
                ).value,

            NumeroInterno:
                document.getElementById(
                    'txtNumeroInterno'
                ).value,

            PersonaResponsable:
                document.getElementById(
                    'cmbPersonaResponsable'
                ).value,

	   Actividad:
   	        document.getElementById(
      		  'txtActividad'
   		).value,

            Estado:'Prestado',

            FechaPrimerSalida:
                new Date().toLocaleDateString(),

            FechaUltimoMovimiento:
                new Date().toLocaleString(),

            Observaciones:
                document.getElementById(
                    'txtObservaciones'
                ).value,

            Activo:'Si'

        };

        const movimiento = {

            ID: Date.now(),

            NoExpediente:
                expediente.NoExpediente,

            NumeroInterno:
                expediente.NumeroInterno,

            TipoMovimiento:'Salida',

            PersonaResponsable:
                expediente.PersonaResponsable,

            Actividad:
                document.getElementById(
                    'txtActividad'
                ).value,

            UsuarioSistema:
                sessionStorage.getItem(
                    'nombre'
                ),

            FechaHora:
                new Date().toLocaleString(),

            Observaciones:
                expediente.Observaciones

        };

        console.log(expediente);
        console.log(movimiento);

await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

        sheet: "EXPEDIENTES",

        ...expediente

    })

});

document.getElementById(
    'txtNoExpediente'
).value = '';

document.getElementById(
    'txtNumeroInterno'
).value = '';

document.getElementById(
    'txtActividad'
).value = '';

document.getElementById(
    'txtObservaciones'
).value = '';

await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

        sheet: "MOVIMIENTOS",

        ...movimiento

    })

});

        alert(
            'Salida registrada correctamente'
        );

    }
    catch(error){

        console.error(error);

        alert(
            'Error al registrar salida'
        );

    }

}


