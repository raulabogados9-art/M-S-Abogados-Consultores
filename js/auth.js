let usuarios = [];

let cacheSistema = {
usuarios: [],
personas: [],
actividades: [],
expedientes: [],
prestados: [],
historico: []
};

/* ==========================
CARGAR USUARIOS
========================== */

async function cargarUsuarios() {

try {

if (cacheSistema.usuarios.length > 0) {
usuarios = cacheSistema.usuarios;
return usuarios;
}

const response = await fetch(API_URL + '?sheet=USUARIOS');
usuarios = await response.json();

cacheSistema.usuarios = usuarios;

return usuarios;

} catch (error) {
console.error('Error cargando usuarios:', error);
return [];
}

}

/* ==========================
LOGIN
========================== */

async function login() {

try {

const usuario = document.getElementById('txtUsuario')?.value.trim() || '';
const password = document.getElementById('txtPassword')?.value.trim() || '';

if (usuario === '' || password === '') {
alert('Ingrese usuario y contraseña');
return;
}

const usuariosData = await cargarUsuarios();

const usuarioValido = usuariosData.find(u =>
String(u.Usuario || '').trim() === usuario &&
String(u.Password || '').trim() === password &&
String(u.Activo || '').trim() === "Si"
);

if (!usuarioValido) {
alert('Usuario o contraseña incorrectos');
return;
}

/* SESIÓN */
sessionStorage.setItem('nombre', usuarioValido.NombreCompleto);
sessionStorage.setItem('usuario', usuarioValido.Usuario);
sessionStorage.setItem('rol', usuarioValido.Rol);
sessionStorage.setItem('DebeCambiarPassword', usuarioValido.DebeCambiarPassword || 'No');

/* UI */
document.getElementById('loginContainer').style.display = 'none';
document.getElementById('mainContainer').style.display = 'block';

document.getElementById('lblUsuario').innerText = usuarioValido.NombreCompleto;
document.getElementById('lblRol').innerText = usuarioValido.Rol;

/* PERMISOS */
if (typeof configurarPermisos === 'function') {
configurarPermisos();
}

/* MODULO INICIAL */
if (typeof mostrarModulo === 'function') {
mostrarModulo('expedientes');
}

/* CARGAS SEGURAS */
try {

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

if (typeof cargarPersonasTabla === 'function') cargarPersonasTabla();
if (typeof cargarActividadesTabla === 'function') cargarActividadesTabla();
if (typeof cargarUsuariosTabla === 'function') cargarUsuariosTabla();

} catch (e) {
console.warn('Error cargas iniciales:', e);
}

} catch (error) {
console.error(error);
alert('Error al iniciar sesión');
}

}

/* ==========================
PERMISOS
========================== */

function configurarPermisos() {

const rol = sessionStorage.getItem('rol') || '';

const modulos = [
'expedientes',
'prestados',
'historico',
'personas',
'actividades',
'usuarios'
];

modulos.forEach(id => {
document.getElementById(id)?.style.setProperty('display', 'none');
});

document.getElementById('expedientes')?.style.setProperty('display', 'block');

if (rol === 'Administrador') {

['menuUsuarios', 'menuPersonas', 'menuActividades'].forEach(id => {
document.getElementById(id)?.style.setProperty('display', '');
});

} else {

['menuUsuarios', 'menuPersonas', 'menuActividades'].forEach(id => {
document.getElementById(id)?.style.setProperty('display', 'none');
});

}

}

/* ==========================
MODULOS
========================== */

function mostrarModulo(id) {

const modulos = [
'expedientes',
'prestados',
'historico',
'personas',
'actividades',
'usuarios'
];

modulos.forEach(m => {
document.getElementById(m)?.style.setProperty('display', 'none');
});

document.getElementById(id)?.style.setProperty('display', 'block');

}

window.mostrarModulo = mostrarModulo;

/* ==========================
LOGOUT
========================== */

function logout() {
sessionStorage.clear();
location.reload();
}

/* ==========================
ONLOAD SEGURO
========================== */

window.onload = async function () {

try {

const nombre = sessionStorage.getItem('nombre');

if (!nombre) return;

document.getElementById('loginContainer').style.display = 'none';
document.getElementById('mainContainer').style.display = 'block';

document.getElementById('lblUsuario').innerText = sessionStorage.getItem('nombre');
document.getElementById('lblRol').innerText = sessionStorage.getItem('rol');

if (typeof configurarPermisos === 'function') {
configurarPermisos();
}

if (sessionStorage.getItem('DebeCambiarPassword') === 'Si') {
setTimeout(() => {
const modal = document.getElementById('modalCambioPassword');
if (modal) new bootstrap.Modal(modal).show();
}, 500);
}

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

if (typeof cargarPersonasTabla === 'function') cargarPersonasTabla();
if (typeof cargarActividadesTabla === 'function') cargarActividadesTabla();
if (typeof cargarUsuariosTabla === 'function') cargarUsuariosTabla();

} catch (e) {
console.error('Error onload:', e);
}

};
