let usuarios=[];

async function cargarUsuarios(){

try{

const response=
await fetch(
API_URL+'?sheet=USUARIOS'
);

usuarios=
await response.json();

return usuarios;

}
catch(error){

console.error(error);

return [];

}

}

async function login(){

const usuario=
document
.getElementById(
'txtUsuario'
)
.value
.trim();

const password=
document
.getElementById(
'txtPassword'
)
.value
.trim();

await cargarUsuarios();

const encontrado=
usuarios.find(u=>

u.Usuario===usuario &&
u.Password===password &&
u.Activo==='Si'

);

if(!encontrado){

alert(
'Usuario o contraseña incorrectos'
);

return;

}

/* GUARDAR SESIÓN */

sessionStorage.setItem(

'usuario',
encontrado.Usuario

);

sessionStorage.setItem(

'nombre',
encontrado.NombreCompleto ||
encontrado.Nombre ||
'Administrador'

);

sessionStorage.setItem(

'rol',
encontrado.Rol

);

/* MOSTRAR SISTEMA */

document.getElementById(
'loginContainer'
).style.display='none';

document.getElementById(
'mainContainer'
).style.display='block';

/* SOLO ESTA ETIQUETA */

document.getElementById(
'lblUsuario'
).innerHTML=

sessionStorage.getItem(
'nombre'
)

+

' ('+

sessionStorage.getItem(
'rol'
)

+')';

/* CARGAR EXPEDIENTES */

if(
typeof cargarExpedientes==='function'
){

cargarExpedientes();

}

/* ADMIN */

if(
encontrado.Rol==='Administrador'
){

document.getElementById(
'menuUsuarios'
).style.display='inline-block';

document.getElementById(
'menuPersonas'
).style.display='inline-block';

document.getElementById(
'menuActividades'
).style.display='inline-block';

if(
typeof cargarUsuariosTabla
==='function'
){

cargarUsuariosTabla();

}

}

/* ARCHIVO */

if(
encontrado.Rol==='Archivo'
){

document.getElementById(
'menuUsuarios'
).style.display='none';

}

/* CONSULTA */

if(
encontrado.Rol==='Consulta'
){

document.getElementById(
'menuUsuarios'
).style.display='none';

document.getElementById(
'menuPersonas'
).style.display='none';

document.getElementById(
'menuActividades'
).style.display='none';

const botonNuevo=

document.querySelector(
'.btn-success'
);

if(
botonNuevo
){

botonNuevo.style.display='none';

}

}

}

function logout(){

sessionStorage.clear();

location.reload();

}

function mostrarModulo(id){

const modulos=[

'expedientes',
'prestados',
'historico',
'personas',
'actividades',
'usuarios'

];

modulos.forEach(modulo=>{

const elemento=

document.getElementById(
modulo
);

if(
elemento
){

elemento.style.display='none';

}

});

document
.getElementById(
id
)
.style.display='block';

/* CARGAS BAJO DEMANDA */

if(

id==='prestados' &&
typeof cargarPrestados==='function'

){

cargarPrestados();

}

if(

id==='historico' &&
typeof cargarHistorico==='function'

){

cargarHistorico();

}

}

/* RECUPERAR SESIÓN */

window.onload=function(){

if(

sessionStorage.getItem(
'usuario'
)

){

document.getElementById(
'loginContainer'
).style.display='none';

document.getElementById(
'mainContainer'
).style.display='block';

document.getElementById(
'lblUsuario'
).innerHTML=

sessionStorage.getItem(
'nombre'
)

+

' ('+

sessionStorage.getItem(
'rol'
)

+')';

if(
typeof cargarExpedientes==='function'
){

cargarExpedientes();

}

}

}
