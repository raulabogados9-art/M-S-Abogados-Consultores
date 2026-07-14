let usuariosSistema = [];
let usuarioEditando = null;

async function cargarUsuarios() {
    try {
        usuariosSistema = await cacheSmart.get('usuarios', async () => {
            const response = await fetch(${API_URL}?sheet=USUARIOS);
            return await response.json();
        });
        cacheSistema.usuarios = usuariosSistema;
        return usuariosSistema;
    } catch (error) {
        console.error('Error cargando usuarios:', error);
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
        const badgeRol = u.Rol === 'Administrador' ? 'bg-dark' : 'bg-secondary';
        const badgeActivo = u.Activo === 'Si' ? 'bg-success' : 'bg-danger';

        tr.innerHTML = `
            <td><strong>${u.Usuario || ''}</strong></td>
            <td>${u.NombreCompleto || ''}</td>
            <td><span class="badge ${badgeRol}">${u.Rol || ''}</span></td>
            <td><span class="badge bg-info text-dark">${u.Area || 'General'}</span></td>
            <td><span class="badge ${badgeActivo}">${u.Activo || ''}</span></td>
            <td class="text-center">
                <div class="btn-group" role="group">
                    <button class="btn btn-warning btn-sm text-dark" onclick="editarUsuario('${u.ID}')">Editar</button>
                    <button class="btn btn-secondary btn-sm" onclick="cambiarEstadoUsuario('${u.ID}','${u.Activo}')">
                        ${u.Activo === 'Si' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="resetPassword('${u.ID}')">Reset</button>
                </div>
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
    
    const txtArea = document.getElementById('txtNuevoArea');
    if (txtArea) txtArea.value = usuario?.Area || 'General';

    const tituloModal = document.getElementById('modalUsuarioTitulo');
    if (tituloModal) tituloModal.innerText = usuario ? '✏️ Editar Usuario Corporativo' : '➕ Crear Nuevo Usuario';

    const modal = new bootstrap.Modal(document.getElementById('modalUsuario'));
    modal.show();
}

async function guardarUsuario() {
    try {
        const txtUsuario = document.getElementById('txtNuevoUsuario').value.trim();
        const txtPassword = document.getElementById('txtNuevoPassword').value.trim();
        const txtNombre = document.getElementById('txtNuevoNombre').value.trim();
        const txtRol = document.getElementById('txtNuevoRol').value;
        const txtArea = document.getElementById('txtNuevoArea')?.value || 'General';

        if (!txtUsuario || !txtNombre) {
            alert('Campos obligatorios incompletos.');
            return;
        }

        if (!usuarioEditando && !txtPassword) {
            alert('Debe asignar una contraseña inicial.');
            return;
        }

        const payload = {
            action: usuarioEditando ? 'EDITAR_USUARIO' : 'CREAR_USUARIO',
            ID: usuarioEditando?.ID || Date.now(),
            Usuario: txtUsuario,
            NombreCompleto: txtNombre,
            Rol: txtRol,
            Area: txtArea,
            Activo: 'Si'
        };

        if (txtPassword) payload.Password = txtPassword;
        else if (usuarioEditando) payload.Password = usuarioEditando.Password;

        await fetch(API_URL, { method: 'POST', body: JSON.stringify(payload) });
        alert('Usuario procesado correctamente.');

        usuarioEditando = null;
        cacheSmart.clear('usuarios');

        const modalElement = document.getElementById('modalUsuario');
        const instanciaModal = bootstrap.Modal.getInstance(modalElement);
        if (instanciaModal) instanciaModal.hide();

        await cargarUsuariosTabla();
    } catch (error) {
        console.error('Error al guardar usuario:', error);
    }
}

async function editarUsuario(id) {
    const usuario = usuariosSistema.find(u => String(u.ID) === String(id));
    if (!usuario) return alert('Usuario no localizado en la caché.');
    abrirModalUsuario(usuario);
}

async function cambiarEstadoUsuario(id, estado) {
    try {
        const nuevoEstado = estado === 'Si' ? 'No' : 'Si';
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'CAMBIAR_ESTADO_USUARIO', ID: id, Activo: nuevoEstado })
        });
        const resultado = await response.json();
        if (resultado.success) {
            alert('Estatus modificado.');
            cacheSmart.clear('usuarios');
            await cargarUsuariosTabla();
        }
    } catch (error) {
        console.error(error);
    }
}

async function resetPassword(id) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'RESET_PASSWORD', ID: id })
        });
        const data = await response.json();
        if (data.success) {
            alert('Contraseña temporal asignada: 123456');
            cacheSmart.clear('usuarios');
            await cargarUsuariosTabla();
        }
    } catch (error) {
        console.error(error);
    }
}

async function guardarCambioPassword() {
    try {
        const nuevaPassword = document.getElementById('txtNuevaPassword').value.trim();
        if (nuevaPassword.length < 6) return alert('Mínimo 6 caracteres.');

        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'CAMBIAR_PASSWORD_PROPIO',
                Usuario: sessionStorage.getItem('usuario'),
                Password: nuevaPassword
            })
        });

        const resultado = await response.json();
        if (resultado.success) {
            alert('Contraseña actualizada.');
            sessionStorage.setItem('DebeCambiarPassword', 'No');
            bootstrap.Modal.getInstance(document.getElementById('modalCambioPassword')).hide();
        }
    } catch (error) {
        console.error(error);
    }
}

window.cargarUsuariosTabla = cargarUsuariosTabla;
window.guardarUsuario = guardarUsuario;
window.abrirModalUsuario = abrirModalUsuario;
window.cambiarEstadoUsuario = cambiarEstadoUsuario;
window.resetPassword = resetPassword;
window.guardarCambioPassword = guardarCambioPassword;
