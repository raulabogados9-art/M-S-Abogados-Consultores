let guardandoExpediente = false;
let prestandoExpediente = false;
let devolviendoExpediente = false;

let ordenExpedientes = {
    columna: null,
    asc: true
};

/* VARIABLES GLOBALES NECESARIAS */
let personas = [];
let expedientesSistema = [];

/* 🔥 ÚNICA FUENTE DE DATOS DEL SISTEMA */
window.cacheSistema = window.cacheSistema || {
    personas: [],
    actividades: [],
    expedientes: [],
    movimientos: []
};

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

async function guardarExpediente(){

if(guardandoExpediente) return;

guardandoExpediente = true;

try{

const expediente = {

ID: Date.now(),

NoExpediente:
document.getElementById('txtNoExpediente').value,

NumeroInterno:
document.getElementById('txtNumeroInterno').value,

PersonaResponsable:
document.getElementById('cmbPersonaResponsable').value,

Actividad:
document.getElementById('txtActividad').value,

Observaciones:
document.getElementById('txtObservaciones').value,

UsuarioCaptura:
sessionStorage.getItem('nombre'),

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

alert('Expediente registrado');

bootstrap.Modal
.getInstance(
document.getElementById('modalSalida')
).hide();

window.cacheSistema.expedientes = [];

await window.cargarExpedientes();

}
catch(error){

console.error(error);

}
finally{

guardandoExpediente = false;

}

}

function renderizarExpedientes(datos){

const tbody =
document.getElementById('tbodyExpedientes');

if(!tbody)return;

/* limpiar una sola vez */
tbody.innerHTML='';

/* filtrar */
const activos =
datos.filter(e => e.Activo === "Si");

/* fragmento DOM (MUCHO más rápido) */
const fragment =
document.createDocumentFragment();

activos.forEach(exp=>{

const tr =
document.createElement('tr');

tr.innerHTML = `

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

`;

fragment.appendChild(tr);

});

tbody.appendChild(fragment);

}

function filtrarExpedientes(){

    if(!window.cacheSistema?.expedientes) return;

    const datos = window.cacheSistema.expedientes;

    const texto =
        document.getElementById('filtroTextoExpediente')?.value.toLowerCase() || '';

    const responsable =
        document.getElementById('filtroResponsable')?.value || '';

    const estado =
        document.getElementById('filtroEstado')?.value || '';

    const filtrados = datos.filter(e => {

        let ok = true;

        if(texto){
            ok =
                (e.NoExpediente||'').toLowerCase().includes(texto) ||
                (e.NumeroInterno||'').toLowerCase().includes(texto) ||
                (e.PersonaResponsable||'').toLowerCase().includes(texto) ||
                (e.Actividad||'').toLowerCase().includes(texto);
        }

        if(responsable){
            ok = ok && e.PersonaResponsable === responsable;
        }

        if(estado){
            ok = ok && e.Estado === estado;
        }

        return ok;
    });

    renderizarExpedientes(filtrados);
}

function refrescarVistaExpedientes(){

    if(typeof filtrarExpedientes !== 'function') return;

    if(!window.cacheSistema?.expedientes) return;

    filtrarExpedientes();
}

/* si no, render normal */

function ordenarExpedientes(columna){

const datos =
cacheSistema.expedientes;

/* cambiar dirección si es la misma columna */
if(ordenExpedientes.columna === columna){
ordenExpedientes.asc = !ordenExpedientes.asc;
}else{
ordenExpedientes.columna = columna;
ordenExpedientes.asc = true;
}

const asc =
ordenExpedientes.asc;

/* copiar para no modificar original */
const ordenados = [...datos].sort((a,b)=>{

let valA = a[columna] || '';
let valB = b[columna] || '';

const numA = parseFloat(valA);
const numB = parseFloat(valB);

if(!isNaN(numA) && !isNaN(numB)){
return asc ? numA - numB : numB - numA;
}

valA = valA.toString().toLowerCase();
valB = valB.toString().toLowerCase();

if(valA < valB) return asc ? -1 : 1;
if(valA > valB) return asc ? 1 : -1;
return 0;

});

renderizarExpedientes(ordenados);

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

const fecha = new Date().toISOString();

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
action:'ELIMINAR_EXPEDIENTE',
ID:id
})
});

alert(
'Expediente prestado correctamente'
);

/* limpiar cache */
window.cacheSistema.expedientes=[];

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

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

const fecha =
new Date().toISOString();

const movimiento={

ID:Date.now(),

NoExpediente:expediente,
NumeroInterno:interno,

TipoMovimiento:'Devolucion',

PersonaResponsable:responsable,

UsuarioSistema:
sessionStorage.getItem('nombre'),

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

/* limpiar cache */
window.cacheSistema.expedientes=[];

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

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


