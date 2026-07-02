let usuarios=[];
let forzarCambioPassword = false;

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

const clean = (v) =>
  String(v ?? '')
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .toLowerCase();

const usuarioValido = usuarios.find(u => {

    const userBD = clean(u.Usuario);
    const passBD = clean(u.Password);
    const activoBD = clean(u.Activo);

    const userInput = clean(usuario);
    const passInput = clean(password);

    console.log("DEBUG LOGIN CLEAN:", {
        userBD,
        passBD,
        activoBD,
        userInput,
        passInput
    });

    return (
        userBD === userInput &&
        passBD === passInput &&
        activoBD === "si"
    );

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
    
/* abrir pantalla inicial */

mostrarModulo(
'expedientes'
);

/* =========================
VALIDAR CAMBIO OBLIGATORIO PASSWORD
========================= */

if (usuarioValido.DebeCambiarPassword === "Si") {

    const modal = new bootstrap.Modal(
        document.getElementById('modalCambioPassword')
    );

    modal.show();
}

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

const rol = sessionStorage.getItem('rol') || '';

/* módulos existentes */

const modulos=[

'expedientes',
'prestados',
'historico',
'personas',
'actividades',
'usuarios'

];

/* OCULTAR TODO */

modulos.forEach(id=>{

const elemento=
document.getElementById(id);

if(elemento){

elemento.style.display='none';

}

});

/* SOLO mostrar Expedientes al iniciar */

document.getElementById(
'expedientes'
)?.style.setProperty(
'display',
'block'
);

/* mostrar menús según rol */

if(rol==='Administrador'){

document.getElementById(
'menuUsuarios'
)?.style.setProperty(
'display',
''
);

document.getElementById(
'menuPersonas'
)?.style.setProperty(
'display',
''
);

document.getElementById(
'menuActividades'
)?.style.setProperty(
'display',
''
);

}

else{

document.getElementById(
'menuUsuarios'
)?.style.setProperty(
'display',
'none'
);

document.getElementById(
'menuPersonas'
)?.style.setProperty(
'display',
'none'
);

document.getElementById(
'menuActividades'
)?.style.setProperty(
'display',
'none'
);

}

}

window.mostrarModulo=mostrarModulo;
    
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

/* CARGAS SEGURAS */
await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

if (typeof cargarPersonasTabla === 'function') cargarPersonasTabla();
if (typeof cargarActividadesTabla === 'function') cargarActividadesTabla();
if (typeof cargarUsuariosTabla === 'function') cargarUsuariosTabla();

}

};

async function guardarCambioPassword() {

    const nuevaPassword = document
        .getElementById('txtNuevaPassword')
        .value
        .trim();

    if (nuevaPassword === "") {
        alert("Ingrese una contraseña");
        return;
    }

    const usuario = sessionStorage.getItem('usuario');

    try {

        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'CAMBIAR_PASSWORD_PROPIO',
                Usuario: usuario,
                Password: nuevaPassword
            })
        });

        const data = await response.json();

        if (data.success) {

            alert("Contraseña actualizada correctamente");

            bootstrap.Modal.getInstance(
                document.getElementById('modalCambioPassword')
            ).hide();

            document.getElementById('txtNuevaPassword').value = "";

        } else {
            alert(data.error || "Error al cambiar contraseña");
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}
