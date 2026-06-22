let personasSistema=[];

async function cargarPersonasTabla(){

try{

const response=
await fetch(
API_URL+'?sheet=PERSONAS'
);

personasSistema=
await response.json();

const tbody=
document.getElementById(
'tbodyPersonas'
);

if(!tbody)return;

tbody.innerHTML='';

personasSistema.forEach(p=>{

tbody.innerHTML+=`

<tr>

<td>${p.Nombre||''}</td>

<td>${p.Actividad||''}</td>

<td>${p.Activo||''}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editarPersona(

'${p.ID}',
'${p.Nombre}',
'${p.Actividad}'

)">

Editar

</button>

<button
class="btn btn-danger btn-sm"
onclick="cambiarEstadoPersona(

'${p.ID}',
'${p.Activo}'

)">

${p.Activo==='Si'
?'Desactivar'
:'Activar'}

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


function abrirModalPersona(){

document.getElementById(
'txtPersonaID'
).value='';

document.getElementById(
'txtPersonaNombre'
).value='';

document.getElementById(
'txtPersonaActividad'
).value='';

new bootstrap.Modal(

document.getElementById(
'modalPersona'
)

).show();

}


function editarPersona(
id,
nombre,
actividad
){

document.getElementById(
'txtPersonaID'
).value=id;

document.getElementById(
'txtPersonaNombre'
).value=nombre;

document.getElementById(
'txtPersonaActividad'
).value=actividad;

new bootstrap.Modal(

document.getElementById(
'modalPersona'
)

).show();

}


async function guardarPersona(){

try{

const persona={

ID:

document.getElementById(
'txtPersonaID'
).value ||

Date.now(),

Nombre:

document.getElementById(
'txtPersonaNombre'
).value,

Actividad:

document.getElementById(
'txtPersonaActividad'
).value,

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

sheet:'PERSONAS',

...persona

})

});

alert(
'Persona guardada correctamente'
);

bootstrap.Modal
.getInstance(

document.getElementById(
'modalPersona'
)

).hide();

cargarPersonasTabla();

}
catch(error){

console.error(error);

}

}


async function cambiarEstadoPersona(
id,
estado
){

alert(
'Pendiente siguiente paso'
);

}
