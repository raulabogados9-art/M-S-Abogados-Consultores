/* =====================================
ROUTER DEL SISTEMA
M&S ABOGADOS CONSULTORES
===================================== */

/* =====================================
EJECUTAR MÓDULO
===================================== */

function ejecutarModulo(modulo){


console.log(
"Cargando módulo:",
modulo.nombre
);



/*
Compatibilidad actual
EXPEDIENTES
*/

if(
modulo.id==="expedientes" &&
typeof mostrarModulo==="function"
){

mostrarModulo(
modulo.id
);

return;

}



/*
Futuros módulos

Aquí después cargaremos:

personas
usuarios
reportes

*/


console.warn(
"Módulo sin cargador:",
modulo.id
);


}


function abrirModulo(id){


const modulo =
SISTEMA.modulos.find(
m=>m.id===id
);



/* ==========================
VALIDAR EXISTENCIA
========================== */

if(!modulo){

console.error(
"Módulo no encontrado:",
id
);

return;

}



/* ==========================
VALIDAR SI ESTÁ ACTIVO
========================== */

if(!modulo.activo){

mostrarAccesoDenegado(
modulo.nombre
);

return;

}



/* ==========================
VALIDAR PERMISO
========================== */

if(
typeof tienePermiso === "function"
){

if(
!tienePermiso(modulo.id)
){

mostrarAccesoDenegado(
modulo.nombre
);

return;

}

}



/* ==========================
ACTUALIZAR SISTEMA
========================== */

SISTEMA.moduloActual=id;


console.log(
"Abriendo módulo:",
modulo.nombre
);

ejecutarModulo(
modulo
);
}



function mostrarAccesoDenegado(nombreModulo){


alert(
"Este usuario no tiene acceso al módulo: "
+
nombreModulo
);


}



window.abrirModulo =
abrirModulo;
