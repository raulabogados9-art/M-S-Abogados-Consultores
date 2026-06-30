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

async function cargarUsuarios() {

    try {

        if (cacheSistema.usuarios.length > 0) {
            usuariosSistema = cacheSistema.usuarios;
            return usuariosSistema;
        }

        const response = await fetch(API_URL + '?sheet=USUARIOS');
        const datos = await response.json();

        usuariosSistema = datos;
        cacheSistema.usuarios = datos;

        return datos;

    } catch (error) {
        console.error(error);
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
                    onclick="editarUsuario('${u.Usuario}')">
                    Editar
                </button>

                <button class="btn btn-secondary btn-sm"
                    onclick="cambiarEstadoUsuario('${u.Usuario}','${u.Activo}')">
                    ${u.Activo === 'Si' ? 'Desactivar' : 'Activar'}
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

        const usuario = {
            Usuario: document.getElementById('txtNuevoUsuario').value,
            Password: document.getElementById('txtNuevoPassword').value,
            NombreCompleto: document.getElementById('txtNuevoNombre').value,
            Rol: document.getElementById('txtNuevoRol').value,
            Activo: 'Si'
        };

        let payload;

        if (usuarioEditando) {

            payload = {
                action: 'EDITAR_USUARIO',
                ...usuario
            };

        } else {

            payload = {
                sheet: 'USUARIOS',
                ID: Date.now(),
                ...usuario
            };

        }

        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        alert('Usuario guardado correctamente');

        bootstrap.Modal.getInstance(
            document.getElementById('modalUsuario')
        ).hide();

        usuarioEditando = null;

        cacheSistema.usuarios = [];

        await cargarUsuariosTabla();

    } catch (error) {
        console.error(error);
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

async function cambiarEstadoUsuario(usuario, estado) {

    const nuevoEstado = estado === 'Si' ? 'No' : 'Si';

    try {

        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'CAMBIAR_ESTADO_USUARIO',
                Usuario: usuario,
                Activo: nuevoEstado
            })
        });

        cacheSistema.usuarios = [];

        await cargarUsuariosTabla();

    } catch (error) {
        console.error(error);
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
