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

async function cargarUsuarios(){

try{

    /* usar cache si ya existe */

    if(cacheSistema.usuarios.length > 0){

        usuarios = cacheSistema.usuarios;

        return usuarios;
    }

    const response =
    await fetch(
        API_URL + '?sheet=USUARIOS'
    );

    usuarios =
    await response.json();

    cacheSistema.usuarios =
    usuarios;

    return usuarios;

}
catch(error){

    console.error(
        'Error cargando usuarios:',
        error
    );

    usuarios=[];

    return [];

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

const usuarios = await cargarUsuarios();

console.log("Usuarios cargados:", usuarios);

console.log(
"Input usuario:",
usuario,
"| password:",
password
);

usuarios.forEach(u => {

console.log({
usuarioBD: String(u.Usuario || '').trim(),
passwordBD: String(u.Password || '').trim(),
activoBD: String(u.Activo || '').trim()
});

});

const usuarioValido = usuarios.find(u => {

const user = String(u.Usuario || '').trim().toLowerCase();

const pass = String(u.Password || '').trim();

const activo = String(u.Activo || '').trim();

return user === usuario.trim().toLowerCase() &&
       pass === password.trim() &&
       activo === "Si";

});

console.log("Usuario encontrado:", usuarioValido);
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


function configurarPermisos(){

const rol =
sessionStorage.getItem('rol');

/* MENUS */

const menuUsuarios =
document.getElementById('menuUsuarios');

const menuPersonas =
document.getElementById('menuPersonas');

const menuActividades =
document.getElementById('menuActividades');

/* MODULOS */

const modulos=[

'expedientes',
'prestados',
'historico',
'personas',
'actividades',
'usuarios'

];

/* ocultar todos */

modulos.forEach(id=>{

const elemento=
document.getElementById(id);

if(elemento){

elemento.style.display='none';

}

});

/* módulos visibles para todos */

document.getElementById('expedientes')?.style.setProperty(
'display',
'block'
);

document.getElementById('prestados')?.style.setProperty(
'display',
'block'
);

document.getElementById('historico')?.style.setProperty(
'display',
'block'
);

/* ADMINISTRADOR */

if(rol==="Administrador"){

if(menuUsuarios)
menuUsuarios.style.display='';

if(menuPersonas)
menuPersonas.style.display='';

if(menuActividades)
menuActividades.style.display='';

document.getElementById('usuarios')?.style.setProperty(
'display',
'block'
);

document.getElementById('personas')?.style.setProperty(
'display',
'block'
);

document.getElementById('actividades')?.style.setProperty(
'display',
'block'
);

}

/* ARCHIVO */

else{

if(menuUsuarios)
menuUsuarios.style.display='none';

if(menuActividades)
menuActividades.style.display='none';

if(menuPersonas)
menuPersonas.style.display='none';

document.getElementById('personas')?.style.setProperty(
'display',
'block'
);

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


window.onload = async function () {

const nombre = sessionStorage.getItem('nombre');

if (nombre) {

document.getElementById('loginContainer').style.display = 'none';
document.getElementById('mainContainer').style.display = 'block';

document.getElementById('lblUsuario').innerText =
sessionStorage.getItem('nombre');

document.getElementById('lblRol').innerText =
sessionStorage.getItem('rol');

configurarPermisos();

/* CARGAS SEGURAS */
await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

if (typeof cargarPersonasTabla === 'function') cargarPersonasTabla();
if (typeof cargarActividadesTabla === 'function') cargarActividadesTabla();
if (typeof cargarUsuariosTabla === 'function') cargarUsuariosTabla();

}

};
