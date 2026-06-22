let personas = [];
let expedientes = [];

async function cargarPersonas(){

try{

const response=
await fetch(
API_URL+'?sheet=PERSONAS'
);

personas=await response.json();

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
.filter(p=>p.Activo==='Si')
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

function abrirModalExpediente(){

cargarPersonas();

new bootstrap.Modal(
document.getElementById(
'modalSalida'
)
).show();

}

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

Activo:'Si',

UsuarioCaptura:
sessionStorage.getItem(
'nombre'
)

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

bootstrap.Modal
.getInstance(
document.getElementById(
'modalSalida'
)
)
.hide();

if(
typeof cargarExpedientes==='function'
){
cargarExpedientes();
}

}
catch(error){

console.error(error);

alert(
error.toString()
);

}

}

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

tbody.innerHTML+=`

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

const usuario=
sessionStorage.getItem(
'nombre'
);

const rol=
sessionStorage.getItem(
'rol'
);

/* FILTRO POR USUARIO */

let expedientesFiltrados=
datos;

if(
rol==='Archivo'
){

expedientesFiltrados=
datos.filter(

e=>

e.UsuarioCaptura===usuario

);

}

expedientesFiltrados.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente}</td>

<td>${exp.NumeroInterno}</td>

<td>${exp.PersonaResponsable}</td>

<td>${exp.Actividad}</td>

<td>${exp.UsuarioCaptura}</td>

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

const prestado={

ID:Date.now(),

NoExpediente:expediente,

NumeroInterno:interno,

PersonaResponsable:responsable,

Actividad:actividad,

Estado:'Prestado',

FechaPrimerSalida:
new Date().toLocaleDateString(),

FechaUltimoMovimiento:
new Date().toLocaleString(),

Observaciones:observaciones,

Activo:'Si',

UsuarioCaptura:
usuarioCaptura

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
new Date().toLocaleString(),

Observaciones:observaciones

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
'Expediente prestado'
);

cargarExpedientes();

cargarPrestados();

}
catch(error){

console.error(error);

alert(
error.toString()
);

}

}
