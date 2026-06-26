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

combo.innerHTML=`
<option value="">
Seleccione...
</option>
`;

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
).value=actividad;

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

Observaciones:
document.getElementById(
'txtObservaciones'
).value,

UsuarioCaptura:
sessionStorage.getItem(
'nombre'
),

Estado:"Disponible",

Activo:"Si"

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

datos
.filter(e=>

e.Activo==="Si"

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

if(prestandoExpediente)return;

prestandoExpediente=true;

try{

const fecha=new Date().toISOString();

const prestado={

ID:Date.now(),

NoExpediente:expediente,
NumeroInterno:interno,
PersonaResponsable:responsable,
Actividad:actividad,

Estado:'Prestado',

FechaPrimerSalida:fecha,
FechaUltimoMovimiento:fecha,

Observaciones:observaciones,
UsuarioCaptura:usuarioCaptura,

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
sessionStorage.getItem('nombre'),

FechaHora:fecha

};


/* guardar prestado */

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

sheet:'PRESTADOS',
...prestado

})

});


/* guardar movimiento */

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

sheet:'MOVIMIENTOS',
...movimiento

})

});


/* eliminar expediente */

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

action:'ELIMINAR_EXPEDIENTE',
ID:id

})

});

alert(
'Expediente prestado correctamente'
);

await cargarExpedientes();

await cargarPrestados();

await cargarHistorico();

}
catch(error){

console.error(error);

alert(
'Error al prestar expediente'
);

}
finally{

prestandoExpediente=false;

}

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

const tbody=
document.getElementById(
'tbodyPrestados'
);

tbody.innerHTML='';

datos.forEach(exp=>{

tbody.innerHTML+=`

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

async function devolverExpediente(
id,
expediente,
interno,
responsable
){

if(devolviendoExpediente)return;

devolviendoExpediente=true;

try{

const fecha=
new Date().toISOString();

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

FechaHora:fecha

};

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

sheet:'MOVIMIENTOS',
...movimiento

})

});

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

action:'ELIMINAR_PRESTADO',
ID:id

})

});

alert(
'Expediente devuelto correctamente'
);

await cargarPrestados();

await cargarExpedientes();

await cargarHistorico();

}
catch(error){

console.error(error);

}
finally{

devolviendoExpediente=false;

}

}


/* ==========================
HISTORICO
========================== */

async function cargarHistorico(){

try{

const response=
await fetch(
API_URL+
'?sheet=MOVIMIENTOS'
);

const datos=
await response.json();

const tbody=
document.getElementById(
'tbodyHistorico'
);

tbody.innerHTML='';

datos.reverse().forEach(mov=>{

let fecha='';

if(mov.FechaHora){

fecha=
new Date(
mov.FechaHora
)
.toLocaleString(
'es-MX',
{
timeZone:'America/Mexico_City',
day:'2-digit',
month:'2-digit',
year:'numeric',
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
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

/* ==========================
BUSCAR EXPEDIENTES
========================== */

function filtrarExpedientes(){

const texto=

document.getElementById(
'txtBuscarExpediente'
)
.value
.toLowerCase();

const filas=

document.querySelectorAll(
'#tbodyExpedientes tr'
);

filas.forEach(fila=>{

const contenido=

fila.innerText.toLowerCase();

fila.style.display=

contenido.includes(texto)
?
''
:
'none';

});

}

window.filtrarExpedientes=
filtrarExpedientes;
