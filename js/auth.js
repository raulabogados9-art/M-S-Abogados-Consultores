/*javascript*/
const API_URL = 'https://script.google.com/macros/s/AKfycbxasYCrzKGGPTUMIJYYPifWqfswdRjdha65DQfegxGUfQAxHGQ-Ukv5Cn5CwzxJ9SQP6Q/exec';

/* ==========================
LOGIN
========================== */

async function login(){

try{

const usuario=
document.getElementById(
'txtUsuario'
).value.trim();

const password=
document.getElementById(
'txtPassword'
).value.trim();

if(
!usuario ||
!password
){

alert(
'Ingrese usuario y contraseña'
);

return;

}

const response=
await fetch(
API_URL+'?sheet=USUARIOS'
);

const usuarios=
await response.json();

const usuarioEncontrado=

usuarios.find(u=>

String(
u.Usuario
).trim()===usuario

&&

String(
u.Password
).trim()===password

&&

String(
u.Activo
).trim()==='Si'

);

if(!usuarioEncontrado){

alert(
'Usuario o contraseña incorrectos'
);

return;

}

/* GUARDAR SESION */

sessionStorage.setItem(
'usuario',
usuarioEncontrado.Usuario
);

sessionStorage.setItem(
'nombre',
usuarioEncontrado.Nombre
);

sessionStorage.setItem(
'rol',
usuarioEncontrado.Rol
);

/* OCULTAR LOGIN */

document.getElementById(
'loginContainer'
).style.display='none';

document.getElementById(
'sistemaContainer'
).style.display='block';


/* MOSTRAR MODULOS SEGUN ROL */

const rol=
usuarioEncontrado.Rol;

if(
rol!=="Administrador"
){

const btnUsuarios=
document.getElementById(
'menuUsuarios'
);

const btnPersonas=
document.getElementById(
'menuPersonas'
);

const btnActividades=
document.getElementById(
'menuActividades'
);

if(btnUsuarios)
btnUsuarios.style.display='none';

if(btnPersonas)
btnPersonas.style.display='none';

if(btnActividades)
btnActividades.style.display='none';

}


/* CARGAR DATOS DEL SISTEMA */

if(
typeof cargarExpedientes==='function'
){

cargarExpedientes();

}

if(
typeof cargarPrestados==='function'
){

cargarPrestados();

}

if(
typeof cargarHistorico==='function'
){

cargarHistorico();

}

if(
typeof cargarPersonasTabla==='function'
){

cargarPersonasTabla();

}

if(
typeof cargarActividadesTabla==='function'
){

cargarActividadesTabla();

}

if(
typeof cargarUsuariosTabla==='function'
){

cargarUsuariosTabla();

}

}
catch(error){

console.error(error);

alert(
'Error al iniciar sesión'
);

}

}


/* ==========================
CERRAR SESION
========================== */

function cerrarSesion(){

sessionStorage.clear();

location.reload();

}
