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
EDITAR ACTIVIDAD
========================== */

function editarActividad(
id,
actividad
){

document.getElementById(
'txtActividadID'
).value=
String(id);

document.getElementById(
'txtActividadNombre'
).value=
actividad;

new bootstrap.Modal(

document.getElementById(
'modalActividad'

)

).show();

}


/* ==========================
GUARDAR ACTIVIDAD
========================== */

async function guardarActividad(){

try{

const id=
document.getElementById(
'txtActividadID'
).value.trim();

const actividad=
document.getElementById(
'txtActividadNombre'
).value.trim();

if(!actividad){

alert(
'Ingrese una actividad'
);

return;

}

const datos={

sheet:'ACTIVIDADES_CATALOGO',

ID:id || Date.now(),

Actividad:actividad,

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

body:JSON.stringify(
datos
)

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

try{

const nuevoEstado=

estado==='Si'
?'No'
:'Si';

await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

action:
'CAMBIAR_ESTADO_ACTIVIDAD',

ID:id,

Activo:nuevoEstado

})

});

alert(
'Estado actualizado correctamente'
);

setTimeout(()=>{

cargarActividadesTabla();

},800);

}
catch(error){

console.error(error);

}

}
