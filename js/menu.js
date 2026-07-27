/* =====================================
MENU CENTRAL DEL SISTEMA
M&S ABOGADOS CONSULTORES
===================================== */


function cargarMenuSistema(){


const menu =
document.getElementById(
"menuSistema"
);


if(!menu){

console.warn(
"No existe contenedor menuSistema"
);

return;

}


menu.innerHTML="";



SISTEMA.modulos.forEach(modulo=>{


if(!modulo.activo){

return;

}



if(
tienePermiso(modulo.id)
){


const boton =
document.createElement("button");


boton.className =
"btn btn-primary";


boton.innerText =
modulo.nombre;



boton.onclick =
()=>{

abrirModulo(
modulo.id
);

};



menu.appendChild(
boton
);


}


});


}



window.cargarMenuSistema =
cargarMenuSistema;
