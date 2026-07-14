/* ==========================================================
   ⚡ ORQUESTRADOR DE PRECARGA ASÍNCRONA INTELIGENTE
   M&S ABOGADOS CONSULTORES — MÁXIMO RENDIMIENTO PARALELO
   ========================================================== */

window.precargarSistema = async function() {
    // Validar si la precarga global está activa en la configuración general
    if (window.CONFIG_SISTEMA?.CACHE?.ACTIVO === false) {
        if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("⚠️ Precarga abortada: El ecosistema de caché está desactivado.");
        return;
    }

    try {
        const tareas = [];
        
        if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🔄 Iniciando ráfaga de precarga en paralelo...");

        /* 1️⃣ PRECARGA DE PERSONAS / RESPONSABLES */
        // Verificamos si cacheSmart tiene datos válidos en memoria o LocalStorage
        if (typeof cacheSmart !== 'undefined' && !cacheSmart.memory[cacheSmart.getAreaKey('personas')]) {
            if (typeof cargarPersonasTabla === 'function') {
                tareas.push(cargarPersonasTabla());
            }
        }

        /* 2️⃣ PRECARGA DE ACTIVIDADES (COMBO/CATÁLOGO) */
        if (typeof cacheSmart !== 'undefined' && !cacheSmart.memory[cacheSmart.getAreaKey('actividades')]) {
            // Apunta de forma segura al cargador del combo en personas.js o actividades.js
            if (typeof cargarActividadesCombo === 'function') {
                tareas.push(cargarActividadesCombo());
            } else if (typeof cargarActividadesTabla === 'function') {
                tareas.push(cargarActividadesTabla());
            }
        }

        /* 3️⃣ PRECARGA DE USUARIOS Y PERMISOS */
        if (typeof cacheSmart !== 'undefined' && !cacheSmart.memory[cacheSmart.getAreaKey('usuarios')]) {
            if (typeof cargarUsuarios === 'function') {
                tareas.push(cargarUsuarios());
            }
        }

        // Ejecución limpia y simultánea por hardware vía Promise.all
        if (tareas.length > 0) {
            await Promise.all(tareas);
            if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log(🚀 Precarga exitosa: ${tareas.length} módulos cacheados en paralelo.);
        } else {
            if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🟢 Todos los catálogos ya se encuentran en caché RAM/Local. Carga instantánea.");
        }

    } catch (error) {
        // Log de contingencia: Si falla un catálogo, no bloqueamos el inicio de sesión del abogado
        console.error("⚠️ Advertencia controlada en el orquestador de precarga:", error);
    }
};
