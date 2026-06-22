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
