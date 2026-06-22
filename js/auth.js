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

}catch(error){

console.error(error);

return [];

}

}

async function login(){

const usuario=
document.getElementById(
'txtUsuario'
).value.trim();

const password=
document.getElementById(
'txtPassword'
).value.trim();

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

if(typeof cargarExpedientes==='function'){

cargarExpedientes();

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
id==='personas'
){

cargarPersonasTabla();

}

if(elemento){

elemento.style.display='none';

}

});

document.getElementById(
id
).style.display='block';

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

if(typeof cargarExpedientes==='function'){

cargarExpedientes();

}

}

}
