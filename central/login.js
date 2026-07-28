/* =====================================================
M&S SISTEMA CENTRAL V3.0
LOGIN CENTRAL
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


const boton =
document.getElementById(
"btnIngresar"
);



boton.onclick =
()=>{

    iniciarSesion();

};


});





/* ==========================
LOGIN
========================== */


function iniciarSesion(){


const usuario =
document.getElementById(
"usuario"
).value.trim();



const password =
document.getElementById(
"password"
).value.trim();



const mensaje =
document.getElementById(
"mensajeLogin"
);




if(
usuario === "" ||
password === ""
){


mensaje.textContent =
"Capture usuario y contraseña";


return;


}





/*
TEMPORAL
VALIDACIÓN DE PRUEBA

Después se conecta
con hoja USUARIOS
*/


if(
usuario === "admin" &&
password === "1234"
){


const sesion = {


usuario:"Administrador",


rol:"Administrador",


fecha:
new Date().toISOString()


};



localStorage.setItem(

"sesionCentral",

JSON.stringify(sesion)

);



window.location.href =
"index.html";



}
else{


mensaje.textContent =
"Usuario o contraseña incorrectos";


}



}
