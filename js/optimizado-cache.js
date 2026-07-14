/* ==========================================================
   💾 SISTEMA DE CACHÉ INTELIGENTE GLOBAL AISLADO (V4 MULTI-ÁREA)
   M&S ABOGADOS CONSULTORES — MÁXIMO RENDIMIENTO MÓVIL
   ========================================================== */

window.cacheSmart = {

    memory: {},
    locks: {},
    
    // Obtener TTL configurado de forma segura, por defecto 1 minuto
    get TTL() {
        return window.CONFIG_SISTEMA?.CACHE?.TTL || 60000;
    },

    /* ==========================================================
       🛡️ REGLA: VALIDAR SI EL MÓDULO TIENE PERMITIDO USAR CACHÉ
       ========================================================== */
    usaCache(key) {
        if (!window.CONFIG_SISTEMA?.CACHE?.ACTIVO) return false;

        // Normalización estricta a Mayúsculas para emparejar con CONFIG_SISTEMA.PRECARGA
        const moduloModulo = String(key).trim().toUpperCase();
        
        return window.CONFIG_SISTEMA?.PRECARGA?.[moduloModulo] === true;
    },

    /* ==========================================================
       🔑 OBTENER LLAVE ÚNICA DE CACHÉ AISLADA (SEGURIDAD MULTI-ÁREA)
       ========================================================== */
    getAreaKey(key) {
        // Obtenemos el área y usuario actual para que la caché de un departamento 
        // jamás se mezcle con la de otro en el mismo dispositivo móvil
        const area = sessionStorage.getItem('area') || 'General';
        const usuario = sessionStorage.getItem('usuario') || 'Anonimo';
        return cache_${area}_${usuario}_${key};
    },

    /* ==========================================================
       📥 RECUPERAR / PROCESAR INFORMACIÓN (GET)
       ========================================================== */
    async get(key, loader) {
        
        // Si el módulo no tiene la precarga o caché activa, va directo al servidor
        if (!this.usaCache(key)) {
            if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🔵 Servidor (Caché Inactivo):", key);
            return await loader();
        }

        const storageKey = this.getAreaKey(key);

        /* 1️⃣ VERIFICACIÓN EN MEMORIA VOLÁTIL RAM */
        if (window.CONFIG_SISTEMA?.CACHE?.USAR_MEMORIA && this.memory[storageKey]) {
            const cacheMem = this.memory[storageKey];
            if (Date.now() - cacheMem.time < this.TTL) {
                if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🟢 Caché RAM:", key);
                return cacheMem.data;
            }
        }

        /* 2️⃣ VERIFICACIÓN EN LOCALSTORAGE (PERSISTENCIA MÓVIL) */
        if (window.CONFIG_SISTEMA?.CACHE?.USAR_LOCALSTORAGE) {
            try {
                const localData = localStorage.getItem(storageKey);
                if (localData) {
                    const cacheLocal = JSON.parse(localData);
                    if (Date.now() - cacheLocal.time < this.TTL) {
                        // Hidratamos la memoria RAM para la siguiente consulta ultra rápida
                        this.memory[storageKey] = cacheLocal;
                        if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🟢 Caché LocalStorage:", key);
                        return cacheLocal.data;
                    }
                }
            } catch (error) {
                console.warn("Advertencia al leer LocalStorage:", error);
            }
        }

        /* 3️⃣ EVITAR PETICIONES DUPLICADAS (REQUEST LOCKING OPTIMIZADO) */
        if (this.locks[storageKey]) {
            if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("⏳ Bloqueo de petición activo. Esperando canal para:", key);
            return new Promise(resolve => {
                const comprobarBloqueo = () => {
                    if (!this.locks[storageKey]) {
                        resolve(this.get(key, loader));
                    } else {
                        // Ajustado a 60ms para mayor velocidad de respuesta en Chrome iPhone
                        setTimeout(comprobarBloqueo, 60); 
                    }
                };
                comprobarBloqueo();
            });
        }

        // Activamos el seguro para congelar peticiones concurrentes idénticas
        this.locks[storageKey] = true;

        try {
            // Disparar la consulta real a la API de Google Apps Script
            const data = await loader();

            const estructuraCache = {
                data: data,
                time: Date.now()
            };

            // Guardar en los almacenes autorizados
            if (window.CONFIG_SISTEMA?.CACHE?.USAR_MEMORIA) {
                this.memory[storageKey] = estructuraCache;
            }

            if (window.CONFIG_SISTEMA?.CACHE?.USAR_LOCALSTORAGE) {
                try {
                    localStorage.setItem(storageKey, JSON.stringify(estructuraCache));
                } catch (e) {
                    console.warn("LocalStorage lleno o deshabilitado:", e);
                }
            }

            if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🔵 Datos frescos desde el Servidor:", key);
            return data;

        } catch (error) {
            console.error(Error crítico en descarga de catálogo [${key}]:, error);
            // Si la red falla por completo, intentamos retornar la caché expirada como salvavidas
            if (this.memory[storageKey]) return this.memory[storageKey].data;
            return [];
        } finally {
            // Liberamos el seguro pase lo que pase
            this.locks[storageKey] = false;
        }
    },

    /* ==========================================================
       🗑️ LIMPIAR UNA CAPA INDIVIDUAL DE INFORMACIÓN
       ========================================================== */
    clear(key) {
        const storageKey = this.getAreaKey(key);
        
        delete this.memory[storageKey];
        
        try {
            localStorage.removeItem(storageKey);
        } catch (e) {}

        if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) console.log("🗑️ Caché específico eliminado:", key);
    },

    /* ==========================================================
       🗑️ LIMPIEZA TOTAL (ÚTIL AL CERRAR SESIÓN / LOGOUT)
       ========================================================== */
    clearAll() {
        this.memory = {};

        try {
            Object.keys(localStorage)
                .filter(k => k.startsWith("cache_"))
                .forEach(k => localStorage.removeItem(k));
        } catch (e) {
            console.error("Error al vaciar LocalStorage:", e);
        }

        console.log("🗑️ Todo el ecosistema de caché ha sido purgado.");
    }
};
