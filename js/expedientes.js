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

    alert(error.toString());

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

       console.log("ANTES FETCH EXPEDIENTE");
	   console.log("DESPUES FETCH EXPEDIENTE");
       console.log("ANTES FETCH MOVIMIENTO");
       console.log("DESPUES FETCH MOVIMIENTO");

await fetch(API_URL,{
    method:"POST",
    mode:"no-cors",
    body:JSON.stringify({
        sheet:"EXPEDIENTES",
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

console.log("ANTES FETCH MOVIMIENTO");

await fetch(API_URL, {

    method: "POST",

    body: JSON.stringify({

        sheet: "MOVIMIENTOS",

        ...movimiento

    })

});

console.log("DESPUES FETCH MOVIMIENTO");
        alert(
            'Salida registrada correctamente'
        );

		bootstrap.Modal.getInstance(
    document.getElementById('modalSalida')
).hide();

		if(typeof cargarExpedientes === 'function'){
    cargarExpedientes();
}

    }
    catch(error){

        console.error(error);

      alert(error.toString());

    }

}

async function cargarPrestados(){

	console.log("CARGANDO PRESTADOS");

try{

    const response =
        await fetch(
            API_URL + '?sheet=EXPEDIENTES'
        );

    const datos =
        await response.json();

    const tbody =
        document.getElementById(
            'tbodyPrestados'
        );

    if(!tbody) return;

    tbody.innerHTML = '';

    datos.forEach(exp => {

        tbody.innerHTML += `

        <tr>

            <td>${exp.NoExpediente}</td>

            <td>${exp.NumeroInterno}</td>

            <td>${exp.PersonaResponsable}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm"
                    onclick="devolverExpediente(
                        '${exp.ID}',
                        '${exp.NoExpediente}',
                        '${exp.NumeroInterno}',
                        '${exp.PersonaResponsable}'
                    )">

                    Devolver

                </button>

            </td>

        </tr>

        `;

    });

}
catch(error){

    console.error(error);

}

}

async function cargarHistorico(){
console.log("CARGANDO HISTORICO");
try{

    const response =
        await fetch(
            API_URL + '?sheet=MOVIMIENTOS'
        );

    const datos =
        await response.json();

    const tbody =
        document.getElementById(
            'tbodyHistorico'
        );

    if(!tbody) return;

    tbody.innerHTML = '';

    datos.reverse().forEach(mov => {

        tbody.innerHTML += `

        <tr>

            <td>${mov.FechaHora}</td>

            <td>${mov.NoExpediente}</td>

            <td>${mov.NumeroInterno}</td>

            <td>${mov.TipoMovimiento}</td>

            <td>${mov.PersonaResponsable}</td>

        </tr>

        `;

    });

}
catch(error){

    console.error(error);

}

}

function devolverExpediente(
id,
expediente,
interno,
responsable
){

alert(
    'Próximo paso: registrar devolución de ' +
    expediente +
    ' / ' +
    interno
);

}

