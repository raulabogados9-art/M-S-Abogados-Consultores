/* ==========================================================
   📂 CORE DE OPERACIONES: GESTIÓN DE EXPEDIENTES Y MOVIMIENTOS
   M&S ABOGADOS CONSULTORES — MÁXIMO RENDIMIENTO DE TABLAS
   ========================================================== */
let personasSistema = [];
let actividadesSistema = [];

async function cargarActividadesCombo() {
    try {
        actividadesSistema = await cacheSmart.get('actividades', async () => {
            const response = await fetch(${API_URL}?sheet=ACTIVIDADES_CATALOGO);
            return await response.json();
        });

        const combo = document.getElementById('txtPersonaActividad');
        if (!combo) return;

        combo.innerHTML = '<option value="">Seleccione...</option>';
        
        const fragment = document.createDocumentFragment();
        actividadesSistema.filter(a => a.Activo === "Si").forEach(a => {
            const option = document.createElement('option');
            option.value = a.Actividad;
            option.textContent = a.Actividad;
            fragment.appendChild(option);
        });
        combo.appendChild(fragment);

    } catch (error) {
        console.error('Error cargando actividades para el combo:', error);
    }
}

async function cargarPersonasTabla() {
    try {
        const userArea = sessionStorage.getItem('area') || 'General';

        const datos = await cacheSmart.get('personas', async () => {
            const response = await fetch(${API_URL}?sheet=PERSONAS);
            return await response.json();
        });

        cacheSistema.personas = datos;
        personasSistema = datos;

        const tbody = document.getElementById('tbodyPersonas');
        if (!tbody) return;

        tbody.innerHTML = '';
        const fragment = document.createDocumentFragment();

        // Filtro estricto departamental
        const datosFiltrados = datos.filter(p => {
            if (userArea === 'General' || userArea === 'Administrador') return true;
            return String(p.Area || '').trim().toLowerCase() === userArea.toLowerCase();
        });

        datosFiltrados.forEach(p => {
            const tr = document.createElement('tr');
            const badgeClass = p.Activo === 'Si' ? 'bg-success' : 'bg-danger';
            
            tr.innerHTML = `
                <td><strong>${p.Nombre || ''}</strong></td>
                <td><span class="badge bg-secondary">${p.Actividad || ''}</span></td>
                <td><span class="badge ${badgeClass}">${p.Activo || ''}</span></td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm text-dark" onclick="editarPersona('${p.ID}', '${p.Nombre}', '${p.Actividad}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="cambiarEstadoPersona('${p.ID}', '${p.Activo}')">${p.Activo === 'Si' ? 'Desactivar' : 'Activar'}</button>
                </td>
            `;
            fragment.appendChild(tr);
        });

        tbody.appendChild(fragment);

    } catch (error) {
        console.error('Error al poblar la tabla de personas:', error);
    }
}

async function abrirModalPersona() {
    document.getElementById('txtPersonaID').value = '';
    document.getElementById('txtPersonaNombre').value = '';
    await cargarActividadesCombo();
    document.getElementById('txtPersonaActividad').value = '';

    const modal = new bootstrap.Modal(document.getElementById('modalPersona'));
    modal.show();
}

async function editarPersona(id, nombre, actividad) {
    document.getElementById('txtPersonaID').value = id;
    document.getElementById('txtPersonaNombre').value = nombre;
    await cargarActividadesCombo();
    document.getElementById('txtPersonaActividad').value = actividad;

    const modal = new bootstrap.Modal(document.getElementById('modalPersona'));
    modal.show();
}

async function guardarPersona() {
    try {
        const idElement = document.getElementById('txtPersonaID').value;
        const nombre = document.getElementById('txtPersonaNombre').value.trim();
        const actividad = document.getElementById('txtPersonaActividad').value.trim();
        const userArea = sessionStorage.getItem('area') || 'General';

        if (!nombre || !actividad) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        const persona = {
            ID: idElement || Date.now(),
            Nombre: nombre,
            Actividad: actividad,
            Area: userArea, 
            Activo: 'Si'
        };

        await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ sheet: 'PERSONAS', ...persona })
        });

        alert('Registro de personal guardado con éxito.');
        cacheSmart.clear('personas');

        const modalElement = document.getElementById('modalPersona');
        const instanciaModal = bootstrap.Modal.getInstance(modalElement);
        if (instanciaModal) instanciaModal.hide();

        await cargarPersonasTabla();

    } catch (error) {
        console.error('Error al guardar la persona:', error);
    }
}

async function cambiarEstadoPersona(id, estadoActual) {
    try {
        const nuevoEstado = estadoActual === "Si" ? "No" : "Si";
        const respuesta = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({ action: "CAMBIAR_ESTADO_PERSONA", ID: id, Activo: nuevoEstado })
        });

        const resultado = await respuesta.json();
        if (resultado.success) {
            alert("Estatus de personal modificado.");
            cacheSmart.clear('personas');
            await cargarPersonasTabla();
        }
    } catch (error) {
        console.error('Error al cambiar el estado del personal:', error);
    }
}

window.cambiarEstadoPersona = cambiarEstadoPersona;
window.editarPersona = editarPersona;
window.guardarPersona = guardarPersona;
window.cargarPersonasTabla = cargarPersonasTabla;
window.abrirModalPersona = abrirModalPersona;
