let personas = [];
let expedientes = [];

/* ==========================
   PERSONAS
========================== */

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

combo.innerHTML=`

<option value="">
Seleccione...
</option>

`;

personas
.filter(p=>p.Activo==="Si")
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

console.error(error);

}

}

function actualizarActividadPersona(){

const combo=
document.getElementById(
'cmbPersonaResponsable'
);

if(
combo.selectedIndex<0
)return;

const actividad=

combo.options[
combo.selectedIndex
]?.dataset.actividad || '';

document.getElementById(
'txtActividad'
).value=actividad;

}

document.addEventListener(
'change',
function(e){

if(
e.target.id==='cmbPersonaResponsable'
){

actualizarActividadPersona();

}

}
);

/* ==========================
   ABRIR MODAL
========================== */

function abrirModalExpediente(){

cargarPersonas();

const modal=
new bootstrap.Modal(

document.getElementById(
'modalSalida'
)

);

modal.show();

}

/* ==========================
   GUARDAR EXPEDIENTE
========================== */

async function guardarExpediente(){

try{

const expediente={

ID:Date.now(),

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

Estado:'Disponible',

FechaPrimerSalida:'',

FechaUltimoMovimiento:'',

Observaciones:
document.getElementById(
'txtObservaciones'
).value,

UsuarioCaptura:
sessionStorage.getItem(
'nombre'
),

Activo:'Si'

};

await fetch(API_URL,{

method:"POST",

mode:"no-cors",

body:JSON.stringify({

sheet:"EXPEDIENTES",

...expediente

})

});

alert(
'Expediente registrado correctamente'
);

/* LIMPIAR */

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

document.getElementById(
'cmbPersonaResponsable'
).selectedIndex=0;

/* CERRAR MODAL */

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

alert(error.toString());

}

}

/* ==========================
   CARGAR EXPEDIENTES
========================== */

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

if(!tbody)return;

tbody.innerHTML='';

const disponibles=
datos.filter(e=>

e.Estado==="Disponible" &&
e.Activo==="Si"

);

disponibles.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente||''}</td>

<td>${exp.NumeroInterno||''}</td>

<td>${exp.PersonaResponsable||''}</td>

<td>${exp.Actividad||''}</td>

<td>${exp.UsuarioCaptura||''}</td>

<td>

<button
class="btn btn-primary btn-sm"

onclick="prestarExpediente(

'${exp.ID}',
'${exp.NoExpediente}',
'${exp.NumeroInterno}',
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Observaciones||""}',
'${exp.UsuarioCaptura||""}'

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

/* ==========================
   PRESTAR
========================== */

async function prestarExpediente(
id,
expediente,
interno,
responsable,
actividad,
observaciones,
usuarioCaptura
){

try{

const fechaMexico=

new Date().toLocaleString(
'es-MX',
{
timeZone:
'America/Mexico_City'
}
);

const prestado={

ID:Date.now(),

NoExpediente:expediente,

NumeroInterno:interno,

PersonaResponsable:responsable,

Actividad:actividad,

Estado:'Prestado',

FechaPrimerSalida:
fechaMexico,

FechaUltimoMovimiento:
fechaMexico,

Observaciones:observaciones,

UsuarioCaptura:
usuarioCaptura,

Activo:'Si'

};

const movimiento={

ID:Date.now(),

NoExpediente:expediente,

NumeroInterno:interno,

TipoMovimiento:'Salida',

PersonaResponsable:responsable,

Actividad:actividad,

UsuarioSistema:
sessionStorage.getItem(
'nombre'
),

FechaHora:
fechaMexico,

Observaciones:
observaciones

};

await fetch(API_URL,{
method:'POST',
mode:'no-cors',
body:JSON.stringify({
sheet:'PRESTADOS',
...prestado
})
});

await fetch(API_URL,{
method:'POST',
mode:'no-cors',
body:JSON.stringify({
sheet:'MOVIMIENTOS',
...movimiento
})
});

await fetch(API_URL,{
method:'POST',
mode:'no-cors',
body:JSON.stringify({
action:'ELIMINAR_EXPEDIENTE',
ID:id
})
});

alert(
'Expediente prestado correctamente'
);

cargarExpedientes();
cargarPrestados();
cargarHistorico();

}
catch(error){

console.error(error);

}

}

/* ==========================
   PRESTADOS
========================== */

async function cargarPrestados(){

try{

const response=
await fetch(
API_URL+'?sheet=PRESTADOS'
);

const datos=
await response.json();

const tbody=
document.getElementById(
'tbodyPrestados'
);

if(!tbody)return;

tbody.innerHTML='';

datos.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente}</td>

<td>${exp.NumeroInterno}</td>

<td>${exp.PersonaResponsable}</td>

<td>

<button
class="btn btn-warning btn-sm">

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

/* ==========================
   HISTORICO
========================== */

async function cargarHistorico(){

try{

const response=
await fetch(
API_URL+'?sheet=MOVIMIENTOS'
);

const datos=
await response.json();

const tbody=
document.getElementById(
'tbodyHistorico'
);

if(!tbody)return;

tbody.innerHTML='';

datos.reverse().forEach(mov=>{

let fecha='';

if(mov.FechaHora){

fecha=
new Date(
mov.FechaHora
).toLocaleString(
'es-MX',
{
timeZone:'America/Mexico_City',
hour:'numeric',
minute:'2-digit',
hour12:true
}
);

}

tbody.innerHTML+=`

<tr>

<td>${fecha}</td>
<td>${mov.NoExpediente||''}</td>
<td>${mov.NumeroInterno||''}</td>
<td>${mov.TipoMovimiento||''}</td>
<td>${mov.PersonaResponsable||''}</td>

</tr>

`;

});

}
catch(error){

console.error(error);

}

}

async function devolverExpediente(
id,
expediente,
interno,
responsable
){

try{

const fechaMexico=

new Date().toLocaleString(
'es-MX',
{
timeZone:'America/Mexico_City'
}
);

const movimiento={

ID:Date.now(),

NoExpediente:expediente,

NumeroInterno:interno,

TipoMovimiento:'Devolucion',

PersonaResponsable:responsable,

UsuarioSistema:
sessionStorage.getItem(
'nombre'
),

FechaHora:
fechaMexico

};

await fetch(API_URL,{

method:'POST',

mode:'no-cors',

body:JSON.stringify({

sheet:'MOVIMIENTOS',

...movimiento

})

});

await fetch(API_URL,{

method:'POST',

mode:'no-cors',

body:JSON.stringify({

action:'ELIMINAR_PRESTADO',

ID:id

})

});

alert(
'Expediente devuelto correctamente'
);

cargarPrestados();

cargarHistorico();

cargarExpedientes();

}
catch(error){

console.error(error);

}

}
