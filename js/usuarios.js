let usuarios=[];

async function cargarUsuarios(){

try{

const response=
await fetch(
API_URL+'?sheet=USUARIOS'
);

usuarios=
await response.json();

return usuarios;

}
catch(error){

console.error(error);

return[];

}

}

async function cargarUsuariosTabla(){

await cargarUsuarios();

const tbody=
document.getElementById(
'tbodyUsuarios'
);

if(!tbody)return;

tbody.innerHTML='';

usuarios.forEach(usuario=>{

tbody.innerHTML+=`

<tr>

<td>${usuario.Usuario || ''}</td>

<td>${usuario.NombreCompleto || ''}</td>

<td>${usuario.Rol || ''}</td>

<td>${usuario.Activo || ''}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editarUsuario(
'${usuario.Usuario}'
)">

Editar

</button>

<button
class="btn btn-secondary btn-sm"
onclick="cambiarEstadoUsuario(
'${usuario.Usuario}',
'${usuario.Activo}'
)">

${usuario.Activo==='Si'
? 'Desactivar'
: 'Activar'}

</button>

<button
class="btn btn-danger btn-sm"
onclick="resetPassword(
'${usuario.Usuario}'
)">

Reset Password

</button>

</td>

</tr>

`;

});

}

function abrirModalUsuario(){

document.getElementById(
'txtNuevoUsuario'
).value='';

document.getElementById(
'txtNuevoPassword'
).value='';

document.getElementById(
'txtNuevoNombre'
).value='';

document.getElementById(
'txtNuevoRol'
).selectedIndex=0;

new bootstrap.Modal(
document.getElementById(
'modalUsuario'
)
).show();

}

async function guardarUsuario(){

try{

const usuario={

ID:Date.now(),

Usuario:
document.getElementById(
'txtNuevoUsuario'
).value,

Password:
document.getElementById(
'txtNuevoPassword'
).value,

NombreCompleto:
document.getElementById(
'txtNuevoNombre'
).value,

Rol:
document.getElementById(
'txtNuevoRol'
).value,

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

mode:'no-cors',

body:JSON.stringify({

sheet:'USUARIOS',

...usuario

})

});

alert(
'Usuario creado correctamente'
);

bootstrap.Modal
.getInstance(
document.getElementById(
'modalUsuario'
)
)
.hide();

cargarUsuariosTabla();

}
catch(error){

console.error(error);

alert(
error.toString()
);

}

}

function editarUsuario(usuario){

alert(
'Edición en siguiente fase: '+usuario
);

}

function cambiarEstadoUsuario(
usuario,
estado
){

alert(

(
estado==='Si'
?
'Desactivar '
:
'Activar '
)

+usuario

);

}

function resetPassword(usuario){

alert(

'Reset contraseña para: '
+
usuario

);

}
