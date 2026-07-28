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
INFORMACIÓN DEL SISTEMA
========================== */

function mostrarInformacionSistema(){


const titulo =
document.getElementById(
"tituloModulo"
);



const version =
document.getElementById(
"versionSistema"
);



if(version){

version.innerText =
SISTEMA.version;

}



if(titulo){

if(SISTEMA.moduloActual){

titulo.innerText =
SISTEMA.moduloActual
.charAt(0)
.toUpperCase()
+
SISTEMA.moduloActual.slice(1);

}

}


}


window.mostrarInformacionSistema =
mostrarInformacionSistema;

/* ==========================
EXPORTAR FUNCIÓN
========================== */


window.mostrarUsuarioSesion =
mostrarUsuarioSesion;
