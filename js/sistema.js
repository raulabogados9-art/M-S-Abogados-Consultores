/* =====================================
ROUTER DEL SISTEMA
===================================== */


function abrirModulo(id){


const modulo =
SISTEMA.modulos.find(
m=>m.id===id
);


if(!modulo){

console.error(
"Módulo no encontrado:",
id
);

return;

}


SISTEMA.moduloActual=id;


console.log(
"Abriendo módulo:",
modulo.nombre
);


/*
Aquí posteriormente cargaremos
el módulo correspondiente
*/


}


window.abrirModulo =
abrirModulo;
