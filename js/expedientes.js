let personas=[];
let expedientes=[];

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

/* SOLO DISPONIBLES */

const disponibles=
datos.filter(e=>

e.Estado==='Disponible' &&
e.Activo==='Si'

);

disponibles.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NoExpediente||''}</td>

<td>${exp.NumeroInterno||''}</td>

<td>${exp.PersonaResponsable||''}</td>

<td>${exp.Actividad||''}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="prestarExpediente(

'${exp.ID}',
'${exp.NoExpediente}',
'${exp.NumeroInterno}',
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Observaciones||""}'

)">

Prestar

</button>

</td>

</tr>

`;

});

}
catch(error){

console.error(
'Error cargando expedientes:',
error
);

}

}

async function prestarExpediente(
id,
expediente,
interno,
responsable,
actividad,
observaciones
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
new Date().toLocaleString(
'es-MX',
{
timeZone:
'America/Mexico_City'
}
),

FechaUltimoMovimiento:
new Date().toLocaleString(
'es-MX',
{
timeZone:
'America/Mexico_City'
}
),

Observaciones:observaciones,

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
new Date().toLocaleString(
'es-MX',
{
timeZone:
'America/Mexico_City'
}
),

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
'Expediente prestado correctamente'
);

cargarExpedientes();
cargarPrestados();

}
catch(error){

console.error(error);

}

}
