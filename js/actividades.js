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
?
'Desactivar'
:
'Activar'}

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

const id=

document.getElementById(
'txtActividadID'
)
.value
.trim();

const actividad=

document.getElementById(
'txtActividadNombre'
)
.value
.trim();

if(!actividad){

alert(
'Ingrese una actividad'
);

return;

}

/* VALIDAR DUPLICADO */

const existe=

actividadesSistema.find(

a=>

a.Actividad
.toLowerCase()

===

actividad
.toLowerCase()

&&

String(a.ID)

!==

String(id)

);

if(existe){

alert(
'La actividad ya existe'
);

return;

}

let datos;

/* EDITAR */

if(id){

datos={

action:
'EDITAR_ACTIVIDAD',

ID:id,

Actividad:actividad

};

}

/* NUEVA */

else{

datos={

sheet:
'ACTIVIDADES_CATALOGO',

ID:
Date.now(),

Actividad:
actividad,

Activo:
'Si'

};

}

const respuesta=
await fetch(API_URL,{

method:'POST',

body:JSON.stringify(
datos
)

});

const resultado=
await respuesta.json();

if(resultado.success){

bootstrap.Modal
.getInstance(

document.getElementById(
'modalActividad'
)

).hide();

alert(
'Actividad guardada correctamente'
);

cargarActividadesTabla();

}else{

alert(
resultado.error
);

}

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
?
'No'
:
'Si';

const respuesta=
await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

action:
'CAMBIAR_ESTADO_ACTIVIDAD',

ID:id,

Activo:nuevoEstado

})

});

const resultado=
await respuesta.json();

if(resultado.success){

alert(
'Estado actualizado correctamente'
);

await cargarActividadesTabla();

}else{

alert(
resultado.error
);

}

}
catch(error){

console.error(error);

alert(
'Error al actualizar'
);

}

}
