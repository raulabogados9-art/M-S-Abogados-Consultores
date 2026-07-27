/* =====================================
   SISTEMA DE PERMISOS POR ROL
   M&S ABOGADOS CONSULTORES
===================================== */


const PERMISOS_ROLES = {

Administrador: {

    registrar: true,
    prestar: true,
    devolver: true,
    exportar: true,

    personas: true,
    actividades: true,
    usuarios: true

},


Archivo: {

    registrar: true,
    prestar: true,
    devolver: true,
    exportar: true,

    personas: false,
    actividades: false,
    usuarios: false

},


Consulta: {

    registrar: false,
    prestar: false,
    devolver: false,
    exportar: false,

    personas: false,
    actividades: false,
    usuarios: false

}


};


/* =====================================
   VALIDAR PERMISO ACTUAL
===================================== */

function tienePermiso(accion){

const rol =
sessionStorage.getItem('rol');


return (
PERMISOS_ROLES[rol] &&
PERMISOS_ROLES[rol][accion] === true
);

}
