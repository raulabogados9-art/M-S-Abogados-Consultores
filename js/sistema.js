/* =====================================
SISTEMA CENTRAL
M&S ABOGADOS CONSULTORES
===================================== */


const SISTEMA = {


nombre:
"M&S Sistema Central",


empresa:
"M&S Abogados Consultores",


version:
"3.0.0",


moduloActual:
null,


modulos:[

{
id:"expedientes",
nombre:"Expedientes",
archivo:"expedientes",
area:"operacion",
activo:true
},

{
id:"personas",
nombre:"Personas",
archivo:"personas",
area:"operacion",
activo:false
},

{
id:"usuarios",
nombre:"Usuarios",
archivo:"usuarios",
area:"seguridad",
activo:false
},

{
id:"reportes",
nombre:"Reportes",
archivo:"reportes",
area:"administracion",
activo:false
},

{
id:"bitacora",
nombre:"Bitácora",
archivo:"bitacora",
area:"administracion",
activo:false
}

]
  
};


window.SISTEMA =
SISTEMA;


/* ===============================
OBTENER USUARIO ACTUAL
=============================== */

function usuarioActual(){

return {

nombre:
sessionStorage.getItem("nombre") || "",


usuario:
sessionStorage.getItem("usuario") || "",


rol:
sessionStorage.getItem("rol") || ""

};

}


window.usuarioActual =
usuarioActual;
