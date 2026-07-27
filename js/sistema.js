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
activo:true
},


{
id:"personas",
nombre:"Personas",
archivo:"personas",
activo:false
},


{
id:"usuarios",
nombre:"Usuarios",
archivo:"usuarios",
activo:false
},

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
