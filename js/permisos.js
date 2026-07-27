/* =====================================
   SISTEMA DE PERMISOS POR ROL
   M&S ABOGADOS CONSULTORES
===================================== */


const PERMISOS_ROLES = {

Administrador: {

    /* MÓDULOS */

    expedientes: true,
    personas: true,
    usuarios: true,
    reportes: true,
    bitacora: true,


    /* ACCIONES EXPEDIENTES */

    registrar: true,
    prestar: true,
    devolver: true,
    exportar: true,

    actividades: true

},


Archivo: {

    /* MÓDULOS */

    expedientes: true,
    personas: false,
    usuarios: false,
    reportes: true,
    bitacora: true,


    /* ACCIONES */

    registrar: true,
    prestar: true,
    devolver: true,
    exportar: true,

    actividades: false

},


Consulta: {

    /* MÓDULOS */

    expedientes: true,
    personas: false,
    usuarios: false,
    reportes: true,
    bitacora: false,


    /* ACCIONES */

    registrar: false,
    prestar: false,
    devolver: false,
    exportar: false,

    actividades: false

}


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
btnExportarHistorico:'exportar',

menuPersonas:'personas',
menuActividades:'actividades',
menuUsuarios:'usuarios'

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
