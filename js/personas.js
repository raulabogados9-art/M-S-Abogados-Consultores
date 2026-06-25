let personasSistema=[];
let actividadesSistema=[];

/* ==========================
CARGAR ACTIVIDADES COMBO
========================== */

async function cargarActividadesCombo(){

try{

const response=
await fetch(
API_URL+'?sheet=ACTIVIDADES_CATALOGO'
);

actividadesSistema=
await response.json();

const combo=
document.getElementById(
'txtPersonaActividad'
);

if(!combo)return;

combo.innerHTML=`
<option value="">
Seleccione...
</option>
`;

actividadesSistema
.filter(
a=>a.Activo==="Si"
)
.forEach(a=>{

combo.innerHTML+=`

<option
value="${a.Actividad}">

${a.Actividad}

</option>

`;

});

}
catch(error){

console.error(error);

}

}

/* ==========================
CARGAR PERSONAS
========================== */

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
?
'Desactivar'
:
'Activar'
}

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
ABRIR MODAL NUEVO
========================== */

async function abrirModalPersona(){

document.getElementById(
'txtPersonaID'
).value='';

document.getElementById(
'txtPersonaNombre'
).value='';

await cargarActividadesCombo();

document.getElementById(
'txtPersonaActividad'
).value='';

new bootstrap.Modal(

document.getElementById(
'modalPersona'

)

).show();

}

/* ==========================
EDITAR PERSONA
========================== */

async function editarPersona(
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

await cargarActividadesCombo();

document.getElementById(
'txtPersonaActividad'
).value=actividad;

new bootstrap.Modal(

document.getElementById(
'modalPersona'

)

).show();

}

/* ==========================
GUARDAR
========================== */

async function guardarPersona(){

try{

const nombre=
document.getElementById(
'txtPersonaNombre'
)
.value.trim();

const actividad=
document.getElementById(
'txtPersonaActividad'
)
.value.trim();

if(nombre===''){

alert(
'Ingrese nombre'
);

return;

}

if(actividad===''){

alert(
'Seleccione actividad'
);

return;

}

const persona={

ID:
document.getElementById(
'txtPersonaID'
).value
||
Date.now(),

Nombre:nombre,

Actividad:actividad,

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

/* ==========================
CAMBIAR ESTADO PERSONA
========================== */

async function cambiarEstadoPersona(id,estadoActual){

try{

const nuevoEstado=
estadoActual==="Si"
?
"No"
:
"Si";

const respuesta=
await fetch(WEBAPP_URL,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

action:"CAMBIAR_ESTADO_PERSONA",
ID:id,
Activo:nuevoEstado

})

});

const resultado=
await respuesta.json();

console.log(resultado);

if(resultado.success){

alert("Estado actualizado");

await cargarPersonasTabla();

}else{

alert(
resultado.error
);

}

}

catch(error){

console.error(error);

alert(
"Error al actualizar"
);

}

}

/* EXPONER FUNCIONES AL HTML */

window.cambiarEstadoPersona = cambiarEstadoPersona;
window.editarPersona = editarPersona;
window.guardarPersona = guardarPersona;
window.cargarPersonasTabla = cargarPersonasTabla;
window.abrirModalPersona = abrirModalPersona;
