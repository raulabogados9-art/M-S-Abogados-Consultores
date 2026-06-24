/*javascript*/
let personas=[];
let guardandoExpediente=false;
let prestandoExpediente=false;
let devolviendoExpediente=false;

/* =======================
PERSONAS
======================= */

async function cargarPersonas(){

try{

const response=
await fetch(
API_URL+'?sheet=PERSONAS'
);

personas=
await response.json();

const combo=
document.getElementById(
'cmbPersonaResponsable'
);

if(!combo)return;

combo.innerHTML=
'<option value="">Seleccione...</option>';

personas
.filter(
p=>p.Activo==="Si"
)
.forEach(p=>{

combo.innerHTML+=`

<option
value="${p.Nombre}"
data-actividad="${p.Actividad}">

${p.Nombre}

</option>

`;

});

}
catch(error){

console.error(error);

}

}

function actualizarActividadPersona(){

const combo=
document.getElementById(
'cmbPersonaResponsable'
);

const actividad=

combo.options[
combo.selectedIndex
]?.dataset.actividad || '';

document.getElementById(
'txtActividad'
).value=
actividad;

}


/* =======================
MODAL
======================= */

function abrirModalExpediente(){

document.getElementById(
'txtNoExpediente'
).value='';

document.getElementById(
'txtNumeroInterno'
).value='';

document.getElementById(
'txtActividad'
).value='';

document.getElementById(
'txtObservaciones'
).value='';

cargarPersonas();

new bootstrap.Modal(

document.getElementById(
'modalSalida'
)

).show();

}


/* =======================
GUARDAR
======================= */

async function guardarExpediente(){

if(guardandoExpediente)return;

guardandoExpediente=true;

try{

const expediente={

ID:Date.now(),

NoExpediente:
document.getElementById(
'txtNoExpediente'
).value.trim(),

NumeroInterno:
document.getElementById(
'txtNumeroInterno'
).value.trim(),

PersonaResponsable:
document.getElementById(
'cmbPersonaResponsable'
).value,

Actividad:
document.getElementById(
'txtActividad'
).value,

Observaciones:
document.getElementById(
'txtObservaciones'
).value,

UsuarioCaptura:
sessionStorage.getItem(
'nombre'
),

Estado:'Disponible',

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

sheet:'EXPEDIENTES',
...expediente

})

});

alert(
'Expediente registrado'
);

bootstrap.Modal
.getInstance(
document.getElementById(
'modalSalida'
)
).hide();

cargarExpedientes();

}
catch(error){

console.error(error);

}

guardandoExpediente=false;

}


/* =======================
EXPEDIENTES
======================= */

async function cargarExpedientes(){

try{

const response=
await fetch(
API_URL+'?sheet=EXPEDIENTES'
);

const datos=
await response.json();

const tbody=
document.getElementById(
'tbodyExpedientes'
);

tbody.innerHTML='';

datos.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente||''}</td>
<td>${exp.NumeroInterno||''}</td>
<td>${exp.PersonaResponsable||''}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="prestarExpediente(

'${exp.ID}',
'${exp.NoExpediente}',
'${exp.NumeroInterno}',
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Observaciones}',
'${exp.UsuarioCaptura}'

)">

Prestar

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


/* =======================
PRESTAR
======================= */

async function prestarExpediente(
id,
expediente,
interno,
responsable,
actividad,
observaciones,
usuarioCaptura
){

alert(
'Prestar funcionando'
);

}


/* =======================
PRESTADOS
======================= */

async function cargarPrestados(){

const response=
await fetch(
API_URL+'?sheet=PRESTADOS'
);

const datos=
await response.json();

console.log(datos);

}


/* =======================
HISTORICO
======================= */

async function cargarHistorico(){

const response=
await fetch(
API_URL+'?sheet=MOVIMIENTOS'
);

const datos=
await response.json();

console.log(datos);

}

