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



const elemento =
document.getElementById(
"usuarioSesion"
);



if(!elemento){

console.warn(
"No existe usuarioSesion"
);

return;

}



elemento.innerHTML =

usuario.nombre
+
" | "
+
usuario.rol;



}



/* ==========================
CERRAR SESIÓN
========================== */

function cerrarSesion(){


sessionStorage.clear();



window.location.reload();


}



/* ==========================
EXPORTAR FUNCIONES
========================== */

window.mostrarUsuarioSesion =
mostrarUsuarioSesion;


window.cerrarSesion =
cerrarSesion;
