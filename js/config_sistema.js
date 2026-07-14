/* ==========================================
CONFIGURACIÓN GENERAL DEL SISTEMA
M&S ABOGADOS CONSULTORES
========================================== */

window.CONFIG_SISTEMA={

/* ==========================
SISTEMA
========================== */

SISTEMA:{

NOMBRE:"M&S ABOGADOS CONSULTORES",

VERSION:"2.0.0",

DEBUG:false

},

/* ==========================
CACHE
========================== */

CACHE:{

ACTIVO:true,

TTL:300000,

USAR_LOCALSTORAGE:true,

USAR_MEMORIA:true

},

/* ==========================
PRECARGA
========================== */

PRECARGA:{

PERSONAS:true,

ACTIVIDADES:true,

USUARIOS:true,

EXPEDIENTES:false,

PRESTADOS:false,

HISTORICO:false

},

/* ==========================
RENDIMIENTO
========================== */

RENDIMIENTO:{

MAX_FETCH_SIMULTANEOS:5,

REINTENTOS_FETCH:2,

TIMEOUT_FETCH:15000

},

/* ==========================
APPS SCRIPT
========================== */

APPS_SCRIPT:{

CACHE_SERVICE:true,

LOCK_SERVICE:true

}

};
