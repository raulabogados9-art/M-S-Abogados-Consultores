let actividadesSistema=[];

/* ==========================
CARGAR ACTIVIDADES
========================== */

async function cargarActividadesTabla(){

try{

const response=
await fetch(
API_URL+'?sheet=ACTIVIDADES_CATALOGO'
);

actividadesSistema=
await response.json();

const tbody=
document.getElementById(
'tbodyActividades'
);

if(!tbody)return;

tbody.innerHTML='';

actividadesSistema.forEach(a=>{

tbody.innerHTML+=`

<tr>

<td>${a.Actividad||''}</td>

<td>${a.Activo||''}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editarActividad(

'${a.ID}',
'${a.Actividad}'

)">

Editar

</button>

<button
class="btn btn-danger btn-sm"
onclick="cambiarEstadoActividad(

'${a.ID}',
'${a.Activo}'

)">

${a.Activo==='Si'
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


/* ==========================
ABRIR MODAL
========================== */

function abrirModalActividad(){

document.getElementById(
'txtActividadID'
).value='';

document.getElementById(
'txtActividadNombre'
).value='';

new bootstrap.Modal(

document.getElementById(
'modalActividad'

)

).show();

}


/* ==========================
EDITAR
========================== */

function editarActividad(
id,
actividad
){

document.getElementById(
'txtActividadID'
).value=id;

document.getElementById(
'txtActividadNombre'
).value=actividad;

new bootstrap.Modal(

document.getElementById(
'modalActividad'

)

).show();

}


/* ==========================
GUARDAR
========================== */

async function guardarActividad(){

try{

const actividad={

ID:

document.getElementById(
'txtActividadID'
).value ||

Date.now(),

Actividad:

document.getElementById(
'txtActividadNombre'
).value,

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

sheet:'ACTIVIDADES_CATALOGO',

...actividad

})

});

alert(
'Actividad guardada correctamente'
);

bootstrap.Modal
.getInstance(

document.getElementById(
'modalActividad'

)

).hide();

cargarActividadesTabla();

}
catch(error){

console.error(error);

}

}


/* ==========================
ACTIVAR / DESACTIVAR
========================== */

async function cambiarEstadoActividad(
id,
estado
){

alert(
'Pendiente siguiente paso'
);

}
