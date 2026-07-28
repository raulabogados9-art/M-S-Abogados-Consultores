/* =====================================
GESTIÓN DE SESIÓN
M&S ABOGADOS CONSULTORES
===================================== */


/* ==========================
MOSTRAR USUARIO ACTUAL
========================== */

function mostrarUsuarioSesion(){


const usuario =
usuarioActual();



const lblUsuario =
document.getElementById(
"lblUsuario"
);



const lblRol =
document.getElementById(
"lblRol"
);



if(lblUsuario){

lblUsuario.innerText =
usuario.nombre || "";

}



if(lblRol){

lblRol.innerText =
usuario.rol || "";

}



}



/* ==========================
EXPORTAR FUNCIÓN
========================== */


window.mostrarUsuarioSesion =
mostrarUsuarioSesion;
