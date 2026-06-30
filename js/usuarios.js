let usuariosSistema = [];
let usuarioEditando = null;

/* usar cache global del sistema */
window.cacheSistema = window.cacheSistema || {
    usuarios: [],
    personas: [],
    actividades: [],
    expedientes: [],
    movimientos: []
};

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

                <button class="btn btn-warning btn-sm"
                    onclick="editarUsuario('${u.ID}')">

                    Editar

                </button>

                <button class="btn btn-secondary btn-sm"
                    onclick="cambiarEstadoUsuario('${u.ID}','${u.Activo}')">

                    ${u.Activo === 'Si'
                    ? 'Desactivar'
                    : 'Activar'}

                </button>

                <button class="btn btn-danger btn-sm"
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

        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
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

function editarUsuario(usuario) {

    const data = usuariosSistema.find(u => u.Usuario === usuario);

    if (!data) return;

    usuarioEditando = data;

    document.getElementById('txtNuevoUsuario').value = data.Usuario;
    document.getElementById('txtNuevoPassword').value = data.Password;
    document.getElementById('txtNuevoNombre').value = data.NombreCompleto;
    document.getElementById('txtNuevoRol').value = data.Rol;

    new bootstrap.Modal(
        document.getElementById('modalUsuario')
    ).show();
}

async function cambiarEstadoUsuario(id, estado){

try{

const nuevoEstado =
estado === 'Si'
? 'No'
: 'Si';

const response =
await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

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
async function resetPassword(usuario) {

    await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
            action: 'RESET_PASSWORD',
            Usuario: usuario,
            Password: '123456'
        })
    });

    alert('Password reseteada a 123456');

    cacheSistema.usuarios = [];

    await cargarUsuariosTabla();
}

window.cargarUsuariosTabla = cargarUsuariosTabla;
window.guardarUsuario = guardarUsuario;
window.abrirModalUsuario = abrirModalUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;
window.resetPassword = resetPassword;
