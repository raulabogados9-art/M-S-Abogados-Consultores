/* =====================================
   MENU CENTRAL DEL SISTEMA
   M&S ABOGADOS CONSULTORES
===================================== */


/* =====================================
   DEFINICIÓN DE MÓDULOS
===================================== */

const MENU_SISTEMA = [

{
    id:"expedientes",
    nombre:"Expedientes",
    permiso:"expedientes"
},


{
    id:"personas",
    nombre:"Personas",
    permiso:"personas"
},


{
    id:"usuarios",
    nombre:"Usuarios",
    permiso:"usuarios"
},


{
    id:"reportes",
    nombre:"Reportes",
    permiso:"reportes"
}


];



/* =====================================
   CREAR MENU
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



MENU_SISTEMA.forEach(modulo=>{


if(
tienePermiso(modulo.permiso)
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
