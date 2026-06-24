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

if(!tbody)return;

tbody.innerHTML='';

datos
.filter(exp=>

exp.Activo==="Si"

)

.forEach(exp=>{

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

const fecha=
new Date().toISOString();

const prestado={

ID,

NoExpediente,
NumeroInterno,
PersonaResponsable,
Actividad,

Estado:'Prestado',

Observaciones,

UsuarioCaptura,

Activo:'Si'

};

/* GUARDAR EN PRESTADOS */

await fetch(API_URL,{

method:'POST',

body.stringify({

sheet:'PRESTADOS',

...prestado

})

});

/* REGISTRAR MOVIMIENTO */

await fetch(API_URL,{

method:'POST',

body.stringify({

sheet:'MOVIMIENTOS',

ID.now(),

NoExpediente,

NumeroInterno,

TipoMovimiento:'Salida',

PersonaResponsable,

Actividad,

UsuarioSistema:
sessionStorage.getItem(
'nombre'
),

FechaHora

})

});

/* ELIMINAR DE EXPEDIENTES */

await fetch(API_URL,{

method:'POST',

body.stringify({

action:'ELIMINAR_EXPEDIENTE',

ID

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
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Observaciones}',
'${exp.UsuarioCaptura}'

)">

Devolver

</button>

</td>

</tr>

`;

});

}


/* =======================
DEVOLVER
======================= */

async function devolverExpediente(
id,
expediente,
interno,
responsable,
actividad,
observaciones,
usuarioCaptura
){

if(devolviendoExpediente)return;

devolviendoExpediente=true;

try{

const fecha=
new Date().toISOString();

/* REGISTRAR DEVOLUCION */

await fetch(API_URL,{

method:'POST',

body.stringify({

sheet:'MOVIMIENTOS',

ID.now(),

NoExpediente,

NumeroInterno,

TipoMovimiento:'Devolucion',

PersonaResponsable,

Actividad,

UsuarioSistema:
sessionStorage.getItem(
'nombre'
),

FechaHora

})

});

/* REGRESAR A EXPEDIENTES */

await fetch(API_URL,{

method:'POST',

body.stringify({

sheet:'EXPEDIENTES',

ID,

NoExpediente,

NumeroInterno,

PersonaResponsable,

Actividad,

Observaciones,

UsuarioCaptura,

Estado:'Disponible',

Activo:'Si'

})

});

/* ELIMINAR DE PRESTADOS */

await fetch(API_URL,{

method:'POST',

body.stringify({

action:'ELIMINAR_PRESTADO',

ID

})

});

alert(
'Expediente devuelto correctamente'
);

await cargarExpedientes();

await cargarPrestados();

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

document
.getElementById(
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

fila.innerText
.toLowerCase();

fila.style.display=

contenido.includes(
texto
)

?''

:'none';

});

}

/* ==========================
BUSCAR HISTORICO
========================== */

function buscarHistorico(){

const texto=

document.getElementById(
'txtBuscarHistorico'
)
.value
.toLowerCase();

const filas=

document.querySelectorAll(
'#tbodyHistorico tr'
);

filas.forEach(fila=>{

const contenido=

fila.innerText
.toLowerCase();

fila.style.display=

contenido.includes(texto)

? ''

: 'none';

});

}
