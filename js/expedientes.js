/* ==========================================================
   📂 CORE DE OPERACIONES: GESTIÓN DE EXPEDIENTES Y MOVIMIENTOS
   M&S ABOGADOS CONSULTORES — MÁXIMO RENDIMIENTO DE TABLAS
   ========================================================== */

let expedientesSistema = [];

// Escucha activa en tiempo real para el input de búsqueda (Optimizado)
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscar = document.getElementById('txtBuscarExpediente');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            const termino = e.target.value.toLowerCase().trim();
            filtrarTablaExpedientesEnPantalla(termino);
        });
    }
});

/* ==========================================================
   📊 CARGAR Y RENDERIZAR TABLA PRINCIPAL DE EXPEDIENTES
   ========================================================== */
async function cargarExpedientesTabla() {
    try {
        const userArea = sessionStorage.getItem('area') || 'General';

        // Descarga fluida protegida bajo el Request Locking del iPhone
        const datos = await cacheSmart.get('expedientes', async () => {
            const response = await fetch(${API_URL}?sheet=EXPEDIENTES);
            return await response.json();
        });

        expedientesSistema = datos;

        const tbody = document.getElementById('tbodyExpedientes');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        // DocumentFragment: Evita el Reflow masivo en Safari/Chrome de iOS
        const fragment = document.createDocumentFragment();

        // Aplicamos el filtro de seguridad de departamento
        const datosFiltrados = expedientesSistema.filter(exp => {
            if (userArea === 'General' || userArea === 'Administrador') return true;
            return String(exp.Area || '').trim().toLowerCase() === userArea.toLowerCase();
        });

        datosFiltrados.forEach(exp => {
            const tr = document.createElement('tr');
            // Clase CSS para el estatus de disponibilidad del expediente
            const badgeEstado = exp.Estado === 'Disponible' ? 'bg-success' : 'bg-warning text-dark';

            tr.innerHTML = `
                <td><strong>${exp.NoExpediente || ''}</strong></td>
                <td>${exp.NumeroInterno || ''}</td>
                <td><span class="badge ${badgeEstado}">${exp.Estado || 'Disponible'}</span></td>
                <td>${exp.PersonaResponsable || 'Ninguno'}</td>
                <td>${exp.Actividad || 'Ninguna'}</td>
                <td><small class="text-muted">${exp.Observaciones || ''}</small></td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm" 
                            onclick="abrirModalPrestamo('${exp.ID}', '${exp.NoExpediente}', '${exp.NumeroInterno}')"
                            ${exp.Estado === 'Prestado' ? 'disabled' : ''}>
                        📋 Prestar
                    </button>
                </td>
            `;
            fragment.appendChild(tr);
        });

        tbody.appendChild(fragment);

    } catch (error) {
        console.error('Error cargando la tabla de expedientes:', error);
    }
}

/* ==========================================================
   🔍 MOTOR DE FILTRADO ULTRA RÁPIDO EN CLIENTE (SIN FETCH)
   ========================================================== */
function filtrarTablaExpedientesEnPantalla(termino) {
    const tbody = document.getElementById('tbodyExpedientes');
    if (!tbody) return;

    const filas = tbody.getElementsByTagName('tr');
    
    for (let i = 0; i < filas.length; i++) {
        const textoFila = filas
