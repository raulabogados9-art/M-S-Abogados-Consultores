/* =====================================
ADMINISTRADOR DE MÓDULOS
M&S SISTEMA CENTRAL
===================================== */

function obtenerModulo(id){

return SISTEMA.modulos.find(
m=>m.id===id
);

}



function moduloActivo(id){

const modulo =
obtenerModulo(id);

return (
modulo &&
modulo.activo===true
);

}



function activarModulo(id){

const modulo =
obtenerModulo(id);

if(!modulo){

return false;

}

modulo.activo=true;

return true;

}



function desactivarModulo(id){

const modulo =
obtenerModulo(id);

if(!modulo){

return false;

}

modulo.activo=false;

return true;

}



/* =====================================
EXPORTAR
===================================== */

window.obtenerModulo =
obtenerModulo;

window.moduloActivo =
moduloActivo;

window.activarModulo =
activarModulo;

window.desactivarModulo =
desactivarModulo;
