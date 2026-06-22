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

<td>${exp.NoExpediente||''}</td>

<td>${exp.NumeroInterno||''}</td>

<td>${exp.PersonaResponsable||''}</td>

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

<td>${mov.FechaHora||''}</td>
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
