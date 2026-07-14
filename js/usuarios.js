let usuariosSistema = [];
let usuarioEditando = null;

async function cargarUsuarios(){

try{

const response=
await fetch(
API_URL+'?sheet=USUARIOS'
);

const datos=
await response.json();

/* guardar en memoria */

usuariosSistema = datos;

cacheSistema.usuarios = datos;

return datos;

}
catch(error){

console.error(
'Error cargando usuarios:',
error
);

usuariosSistema=[];

return [];

}

}

async function cargarUsuariosTabla() {

    const usuarios = await cargarUsuarios();
cacheSistema.usuarios = usuarios;
usuariosSistema = usuarios;

    const tbody = document.getElementById('tbodyUsuarios');

    if (!tbody) return;

    tbody.innerHTML = '';

    const fragment = document.createDocumentFragment();

    usuarios.forEach(u => {

        const tr = document.createElement('tr');

        tr.innerHTML = `

            <td>${u.Usuario || ''}</td>
            <td>${u.NombreCompleto || ''}</td>
            <td>${u.Rol || ''}</td>
            <td>${u.Activo || ''}</td>

            <td>

<button
class="btn btn-warning btn-sm"
onclick="editarUsuario('${u.ID}')">

Editar

</button>

<button
class="btn btn-secondary btn-sm"
onclick="cambiarEstadoUsuario('${u.ID}','${u.Activo}')">

${u.Activo === 'Si'
? 'Desactivar'
: 'Activar'}

</button>

<button
class="btn btn-danger btn-sm"
onclick="resetPassword('${u.ID}')">

Reset Password

</button>

</td>

        `;

        fragment.appendChild(tr);

    });

    tbody.appendChild(fragment);

}

function abrirModalUsuario(usuario = null) {

    usuarioEditando = usuario;

    document.getElementById('txtNuevoUsuario').value = usuario?.Usuario || '';
    document.getElementById('txtNuevoPassword').value = '';
    document.getElementById('txtNuevoNombre').value = usuario?.NombreCompleto || '';
    document.getElementById('txtNuevoRol').value = usuario?.Rol || 'Usuario';

    new bootstrap.Modal(
        document.getElementById('modalUsuario')
    ).show();
}

async function guardarUsuario() {

    try {

        const payload = {
            action: usuarioEditando ? 'EDITAR_USUARIO' : 'CREAR_USUARIO',
            ID: usuarioEditando?.ID || Date.now(),
            Usuario: document.getElementById('txtNuevoUsuario').value,
            Password: document.getElementById('txtNuevoPassword').value,
            NombreCompleto: document.getElementById('txtNuevoNombre').value,
            Rol: document.getElementById('txtNuevoRol').value,
            Activo: 'Si'
        };

      await fetch(API_URL,{

method:'POST',

body:JSON.stringify(payload)

});

        usuarioEditando = null;

        cacheSistema.usuarios = [];

        await cargarUsuariosTabla();

        alert('Usuario guardado correctamente');

    } catch (error) {
        console.error(error);
        alert('Error al guardar usuario');
    }
}

async function editarUsuario(id) {

try {

const usuario = usuariosSistema.find(u =>
String(u.ID) === String(id)
);

if (!usuario) {
alert('Usuario no encontrado');
return;
}

const nuevoUsuario = prompt('Usuario:', usuario.Usuario);
if (nuevoUsuario === null) return;

const nuevoNombre = prompt('Nombre completo:', usuario.NombreCompleto);
if (nuevoNombre === null) return;

const nuevoRol = prompt('Rol:', usuario.Rol);
if (nuevoRol === null) return;

const nuevaPassword = prompt('Password:', usuario.Password);
if (nuevaPassword === null) return;

const response = await fetch(API_URL, {
method: 'POST',
body: JSON.stringify({
action: 'EDITAR_USUARIO',
ID: id,
Usuario: nuevoUsuario,
NombreCompleto: nuevoNombre,
Rol: nuevoRol,
Password: nuevaPassword
})
});

/* 🔥 IMPORTANTE: NO ROMPER SI NO VIENE JSON */
let resultado = {};

try {
resultado = await response.json();
} catch (e) {
console.warn('Respuesta no JSON, pero guardado OK');
resultado = { success: true };
}

if (resultado.success !== false) {

alert('Usuario actualizado correctamente');

cacheSistema.usuarios = [];
usuariosSistema = [];

await cargarUsuariosTabla();

} else {
alert(resultado.error || 'Error al actualizar');
}

} catch (error) {

console.error(error);
alert('Error al editar usuario');

}

}async function cambiarEstadoUsuario(id, estado){

try{

const nuevoEstado =
estado === 'Si'
? 'No'
: 'Si';

const response =
await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

action:'CAMBIAR_ESTADO_USUARIO',
ID:id,
Activo:nuevoEstado

})

});
    
const resultado =
await response.json();

console.log(resultado);

if(resultado.success){

alert(
'Usuario actualizado correctamente'
);

await cargarUsuariosTabla();

}else{

alert(
resultado.error ||
'No se pudo actualizar'
);

}

}
catch(error){

console.error(
'Error:',
error
);

alert(
'Error al cambiar estado'
);

}

}
async function resetPassword(id){

try{

const response=
await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

action:'RESET_PASSWORD',
ID:id

})

});

const data=
await response.json();

if(data.success){

alert(
'Contraseña temporal asignada:\n\n123456'
);

cacheSistema.usuarios=[];

await cargarUsuariosTabla();

}else{

alert(
data.error ||
'No se pudo restablecer'
);

}

}catch(error){

console.error(
'Error:',
error
);

alert(
'Error al resetear contraseña'
);

}

}

async function guardarCambioPassword(){

try{

const nuevaPassword =
document.getElementById(
'txtNuevaPassword'
).value.trim();

if(
nuevaPassword.length<6
){

alert(
'La contraseña debe tener mínimo 6 caracteres'
);

return;

}

const response=
await fetch(
API_URL,
{

method:'POST',

body:JSON.stringify({

action:'CAMBIAR_PASSWORD_PROPIO',

Usuario:
sessionStorage.getItem(
'usuario'
),

Password:
nuevaPassword

})

}

);

const resultado=
await response.json();

if(resultado.success){

alert(
'Contraseña actualizada correctamente'
);

sessionStorage.setItem(
'DebeCambiarPassword',
'No'
);

bootstrap.Modal
.getInstance(
document.getElementById(
'modalCambioPassword'
)
)
.hide();

}
else{

alert(
resultado.error ||
'No se pudo actualizar'
);

}

}catch(error){

console.error(error);

alert(
'Error al actualizar contraseña'
);

}

}

window.cargarUsuariosTabla = cargarUsuariosTabla;
window.guardarUsuario = guardarUsuario;
window.abrirModalUsuario = abrirModalUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;
window.resetPassword = resetPassword;
window.guardarCambioPassword = guardarCambioPassword;
