let usuarios=[];

/* ==========================
CACHE DEL SISTEMA
========================== */

let cacheSistema={

usuarios:[],
personas:[],
actividades:[],
expedientes:[],
prestados:[],
historico:[]

};

/* ==========================
CARGAR USUARIOS
========================== */

async function cargarUsuariosSistema(){

try{

/* usar cache si ya existe */

if(cacheSistema.usuarios.length>0){

usuarios=cacheSistema.usuarios;
return;

}

const response=
await fetch(
API_URL+'?sheet=USUARIOS'
);

usuarios=
await response.json();

/* guardar cache */

cacheSistema.usuarios=usuarios;

}
catch(error){

console.error(
'Error cargando usuarios:',
error
);

usuarios=[];

}

}


/* ==========================
LOGIN
========================== */

async function login(){

try{

const usuario=

document.getElementById(
'txtUsuario'
)
.value
.trim();

const password=

document.getElementById(
'txtPassword'
)
.value
.trim();

if(
usuario==='' ||
password===''
){

alert(
'Ingrese usuario y contraseña'
);

return;

}

await cargarUsuariosSistema();

const usuarioValido=

usuarios.find(u=>

u.Usuario===usuario &&

u.Password===password &&

u.Activo==="Si"

);

if(!usuarioValido){

alert(
'Usuario o contraseña incorrectos'
);

return;

}

/* GUARDAR SESION */

sessionStorage.setItem(
'nombre',
usuarioValido.NombreCompleto
);

sessionStorage.setItem(
'usuario',
usuarioValido.Usuario
);

sessionStorage.setItem(
'rol',
usuarioValido.Rol
);

/* MOSTRAR SISTEMA */

document.getElementById(
'loginContainer'
).style.display='none';

document.getElementById(
'mainContainer'
).style.display='block';

document.getElementById(
'lblUsuario'
).innerText =
usuarioValido.NombreCompleto;

document.getElementById(
'lblRol'
).innerText =
usuarioValido.Rol;


/* PERMISOS */

configurarPermisos();


/* CARGAS INICIALES */

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

cargarPersonasTabla();

cargarActividadesTabla();

cargarUsuariosTabla();

}
catch(error){

console.error(
error
);

alert(
'Error al iniciar sesión'
);

}

}


/* ==========================
PERMISOS
========================== */

function configurarPermisos(){

const rol=

sessionStorage.getItem(
'rol'
);

const menuUsuarios=
document.getElementById(
'menuUsuarios'
);

const menuPersonas=
document.getElementById(
'menuPersonas'
);

const menuActividades=
document.getElementById(
'menuActividades'
);

if(
rol==="Administrador"
){

menuUsuarios.style.display='';
menuPersonas.style.display='';
menuActividades.style.display='';

}
else{

menuUsuarios.style.display='none';
menuPersonas.style.display='none';
menuActividades.style.display='none';

}

}


/* ==========================
LOGOUT
========================== */

function logout(){

sessionStorage.clear();

location.reload();

}


/* ==========================
CAMBIAR MODULOS
========================== */

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

if(elemento){

elemento.style.display='none';

}

});

document.getElementById(
id
).style.display='block';

}


/* ==========================
VALIDAR SESION AL CARGAR
========================== */

window.onload=function(){

const nombre=

sessionStorage.getItem(
'nombre'
);

if(nombre){

document.getElementById(
'loginContainer'
).style.display='none';

document.getElementById(
'mainContainer'
).style.display='block';

document.getElementById(
'lblUsuario'
).innerText =
sessionStorage.getItem('nombre');

document.getElementById(
'lblRol'
).innerText =
sessionStorage.getItem('rol');
  
configurarPermisos();

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();;

cargarPersonasTabla();

cargarActividadesTabla();

cargarUsuariosTabla();

}

}
