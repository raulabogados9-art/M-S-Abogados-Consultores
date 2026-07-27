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

/* =====================================
   APLICAR PERMISOS VISUALES
===================================== */

function aplicarPermisos(){

    const elementos = {

    btnNuevoExpediente:'registrar',
    btnPrestarTodos:'prestar',
    btnExportarHistorico:'exportar'

};


    Object.keys(elementos).forEach(id=>{

        const elemento =
        document.getElementById(id);


        if(!elemento){
            return;
        }


        if(!tienePermiso(elementos[id])){

            elemento.style.display='none';

        }

    });

}


/* =====================================
   COMPATIBILIDAD CON AUTH.JS
===================================== */

function configurarPermisos(){

    aplicarPermisos();

}
