/* ==========================================================
   ⚙️ CONFIGURACIÓN GENERAL DEL SISTEMA CENTRAL V2
   M&S ABOGADOS CONSULTORES — SISTEMA INTEGRAL MODULAR
   ========================================================== */

window.CONFIG_SISTEMA = {

    /* ==========================================
       🏢 DATOS DE LA FIRMA / SISTEMA
       ========================================== */
    SISTEMA: {
        NOMBRE: "M&S ABOGADOS CONSULTORES",
        VERSION: "2.1.0 (Multi-Área)",
        DEBUG: false
    },

    /* ==========================================
       💾 ESTRATEGIA DE CACHÉ INTELIGENTE (CLIENTE)
       ========================================== */
    CACHE: {
        ACTIVO: true,
        // Reducido a 60,000ms (1 minuto) para evitar que dos usuarios simultáneos
        // vean datos desfasados al prestar/devolver expedientes.
        TTL: 60000, 
        USAR_LOCALSTORAGE: true,
        USAR_MEMORIA: true
    },

    /* ==========================================
       🔄 CONTROL DE CARGA EN PARALELO
       ========================================== */
    PRECARGA: {
        // Activados en true para coordinarse perfectamente con el Promise.all de auth.js
        PERSONAS: true,
        ACTIVIDADES: true,
        USUARIOS: true,
        EXPEDIENTES: true,
        PRESTADOS: true,
        HISTORICO: true
    },

    /* ==========================================
       ⚡ RENDIMIENTO MÓVIL Y RED (IPHONE / CHROME)
       ========================================== */
    RENDIMIENTO: {
        MAX_FETCH_SIMULTANEOS: 6, // Ajustado a 6 para los 6 canales en paralelo
        REINTENTOS_FETCH: 3,      // Aumentado a 3 por si falla la señal móvil del celular
        TIMEOUT_FETCH: 12000      // Reducido a 12s para no dejar la pantalla congelada si la red cae
    },

    /* ==========================================
       🛡️ SEGURIDAD MULTIUSUARIO Y CONCURRENCIA (BACKEND)
       ========================================== */
    APPS_SCRIPT: {
        CACHE_SERVICE: true,
        // MANDATORIO: Asegura que si dos usuarios dan clic al mismo tiempo en "Prestar",
        // Apps Script bloquee la hoja por milisegundos para evitar que se duplique o sobreescriba.
        LOCK_SERVICE: true 
    },

    /* ==========================================
       🌐 SEGMENTACIÓN POR ÁREAS DE LA EMPRESA
       ========================================== */
    AREAS_CONFIG: {
        MODULO_FILTRADO_ACTIVO: true,
        // Áreas por defecto del sistema central si la base de datos no responde
        AREAS_VALIDAS: ["General", "Civil", "Penal", "Corporativo", "Laboral", "Administración"]
    }

};
