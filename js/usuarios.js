let usuariosSistema = [];

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

        if (window.cacheSistema.usuarios.length > 0) {
            usuariosSistema = window.cacheSistema.usuarios;
            return usuariosSistema;
        }

        const response = await fetch(API_URL + '?sheet=USUARIOS');
        const datos = await response.json();

        usuariosSistema = datos;
        window.cacheSistema.usuarios = datos;

        return datos;

    } catch (error) {
        console.error(error);
        return [];
    }
}

async function cargarUsuariosTabla() {

    await cargarUsuarios();

    const tbody = document.getElementById('tbodyUsuarios');
    if (!tbody) return;

    tbody.innerHTML = '';

    usuariosSistema.forEach(usuario => {

        tbody.innerHTML += `
            <tr>
                <td>${usuario.Usuario || ''}</td>
                <td>${usuario.NombreCompleto || ''}</td>
                <td>${usuario.Rol || ''}</td>
                <td>${usuario.Activo || ''}</td>

                <td>

                    <button class="btn btn-warning btn-sm"
                        onclick="editarUsuario('${usuario.Usuario}')">
                        Editar
                    </button>

                    <button class="btn btn-secondary btn-sm"
                        onclick="cambiarEstadoUsuario('${usuario.Usuario}','${usuario.Activo}')">
                        ${usuario.Activo === 'Si' ? 'Desactivar' : 'Activar'}
                    </button>

                    <button class="btn btn-danger btn-sm"
                        onclick="resetPassword('${usuario.Usuario}')">
                        Reset Password
                    </button>

                </td>
            </tr>
        `;
    });
}

function abrirModalUsuario() {

    document.getElementById('txtNuevoUsuario').value = '';
    document.getElementById('txtNuevoPassword').value = '';
    document.getElementById('txtNuevoNombre').value = '';
    document.getElementById('txtNuevoRol').selectedIndex = 0;

    new bootstrap.Modal(
        document.getElementById('modalUsuario')
    ).show();
}

async function guardarUsuario() {

    try {

        const usuario = {

            ID: Date.now(),

            Usuario: document.getElementById('txtNuevoUsuario').value,
            Password: document.getElementById('txtNuevoPassword').value,
            NombreCompleto: document.getElementById('txtNuevoNombre').value,
            Rol: document.getElementById('txtNuevoRol').value,
            Activo: 'Si'

        };

        await fetch(API_URL, {

            method: 'POST',

            body: JSON.stringify({
                sheet: 'USUARIOS',
                ...usuario
            })

        });

        alert('Usuario creado correctamente');

        bootstrap.Modal
            .getInstance(document.getElementById('modalUsuario'))
            .hide();

        window.cacheSistema.usuarios = [];

        await cargarUsuariosTabla();

    } catch (error) {

        console.error(error);
        alert('Error al guardar usuario');

    }
}

function editarUsuario(usuario) {
    console.log('Editar usuario:', usuario);
}

function cambiarEstadoUsuario(usuario, estado) {
    console.log('Cambiar estado:', usuario, estado);
}

function resetPassword(usuario) {
    console.log('Reset password:', usuario);
}

window.cargarUsuariosTabla = cargarUsuariosTabla;
window.guardarUsuario = guardarUsuario;
window.editarUsuario = editarUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;
window.resetPassword = resetPassword;
