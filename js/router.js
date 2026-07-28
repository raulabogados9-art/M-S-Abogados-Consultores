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



const cargador =
CARGADORES_MODULOS[modulo.id];



if(!cargador){

console.warn(
"No existe cargador para:",
modulo.id
);

return;

}



if(!cargador.funcion){

console.warn(
"Módulo sin función activa:",
modulo.id
);

return;

}



/*
Buscar función real
*/

const funcion =
window[cargador.funcion];



if(
typeof funcion !== "function"
){

console.error(
"Función no encontrada:",
cargador.funcion
);

return;

}



funcion(
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


if(typeof mostrarInformacionSistema==='function'){

    mostrarInformacionSistema();

}


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
