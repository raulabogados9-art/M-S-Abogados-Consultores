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

console.log(
'API:',
API_URL
);

const response=
await fetch(
API_URL+'?sheet=PERSONAS'
);

personas=
await response.json();

console.log(
'PERSONAS:',
personas
);

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
.forEach(persona=>{

combo.innerHTML+=`

<option
value="${persona.Nombre}"
data-actividad="${persona.Actividad}">

${persona.Nombre}

</option>

`;

});

}
catch(error){

console.error(
'ERROR PERSONAS:',
error
);

}

}


/* =======================
ACTIVIDAD AUTOMATICA
======================= */

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


document.addEventListener(
'change',
function(e){

if(

e.target.id===
'cmbPersonaResponsable'

){

actualizarActividadPersona();

}

}
);


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

console.log(
'EXPEDIENTES:',
datos
);

const tbody=
document.getElementById(
'tbodyExpedientes'
);

if(!tbody)return;

tbody.innerHTML='';

datos
.filter(
e=>e.Activo==="Si"
)
.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente||''}</td>

<td>${exp.NumeroInterno||''}</td>

<td>${exp.PersonaResponsable||''}</td>

<td>${exp.Estado||''}</td>

<td>${exp.UsuarioCaptura||''}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="prestarExpediente(

'${exp.ID}',
'${exp.NoExpediente}',
'${exp.NumeroInterno}'

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

function prestarExpediente(){

alert(
'Prestar funcionando'
);

}


/* =======================
PRESTADOS
======================= */

async function cargarPrestados(){

console.log(
'Prestados activo'
);

}


/* =======================
HISTORICO
======================= */

async function cargarHistorico(){

console.log(
'Historico activo'
);

}

