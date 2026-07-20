let guardandoExpediente = false;
let prestandoExpediente = false;
let devolviendoExpediente = false;

let ordenExpedientes = {
    columna: null,
    asc: true
};

/* VARIABLES GLOBALES NECESARIAS */
let personas = [];
let expedientesSistema = [];



/* =======================
PERSONAS
======================= */

async function cargarPersonas(){

try{

/* ==========================
USAR CACHE SI YA EXISTE
========================== */

if(
cacheSistema.personas &&
cacheSistema.personas.length > 0
){

personas = cacheSistema.personas;

const combo =
document.getElementById(
'cmbPersonaResponsable'
);

if(combo){

combo.innerHTML =
'<option value="">Seleccione...</option>';

personas
.filter(p=>p.Activo==="Si")
.forEach(persona=>{

combo.innerHTML += `
<option
value="${persona.Nombre}"
data-actividad="${persona.Actividad||''}">
${persona.Nombre}
</option>
`;

});

}

return personas;

}

const response =
await fetch(API_URL+'?sheet=PERSONAS');

personas =
await response.json();

/* guardar cache */
cacheSistema.personas = personas;

const combo =
document.getElementById('cmbPersonaResponsable');

if(!combo) return;

/* limpiar select */
combo.innerHTML = `
<option value="">Seleccione...</option>
`;

personas
.filter(p => p.Activo === "Si")
.forEach(persona => {

combo.innerHTML += `
<option value="${persona.Nombre}"
data-actividad="${persona.Actividad || ''}">
${persona.Nombre}
</option>
`;

});

return personas;

}
catch(error){

console.error('Error cargando personas:', error);
return [];

}

}

function actualizarActividadPersona(){

const combo=
document.getElementById(
'cmbPersonaResponsable'
);

const actividad=

combo.options[
combo.selectedIndex
]?.dataset.actividad || '';

document.getElementById(
'txtActividad'
).value=actividad;

}

document.addEventListener(
'change',
function(e){

if(
e.target.id===
'cmbPersonaResponsable'
){

actualizarActividadPersona();

}

}
);


/* =======================
MODAL
======================= */

async function abrirModalExpediente() {

    // 1. limpiar campos
    document.getElementById('txtNoExpediente').value = '';
    document.getElementById('txtNumeroInterno').value = '';
    document.getElementById('txtActividad').value = '';
    document.getElementById('txtObservaciones').value = '';

    try {

        // 2. FORZAR carga real de personas (no cache vieja)
        await cargarPersonas();

        console.log('PERSONAS CARGADAS:', cacheSistema.personas);

        // 3. validar que sí llegaron datos
        if (!cacheSistema.personas || cacheSistema.personas.length === 0) {
            console.error('No llegaron personas desde backend');
            return;
        }

            /* asegurar sincronización del DOM */
setTimeout(()=>{

const select=
document.getElementById(
'cmbPersonaResponsable'
);

if(select && select.options.length>0){

actualizarActividadPersona();

}

},100);

       /* ya cargarPersonas llena el select */
/* solo actualizar actividad inicial */

const select =
document.getElementById(
'cmbPersonaResponsable'
);

if(!select){

console.error(
'No existe cmbPersonaResponsable'
);

return;

}

/* asegurar evento */
select.removeEventListener(
'change',
actualizarActividadPersona
);

select.addEventListener(
'change',
actualizarActividadPersona
);

/* forzar actualización inicial */
if(select.value){

actualizarActividadPersona();

}
    } catch (error) {
        console.error('Error en abrirModalExpediente:', error);
    }

    // 5. abrir modal
    const modal = new bootstrap.Modal(
        document.getElementById('modalSalida')
    );

    modal.show();
}
async function guardarExpediente(){

if(guardandoExpediente) return;

guardandoExpediente = true;

try{

const expediente = {

ID: Date.now(),

NumeroInterno:
document.getElementById('txtNumeroInterno').value,
    
NoExpediente:
document.getElementById('txtNoExpediente').value,

PersonaResponsable:
document.getElementById('cmbPersonaResponsable').value,

Actividad:
document.getElementById('cmbPersonaResponsable')
.options[
document.getElementById('cmbPersonaResponsable').selectedIndex
]?.dataset?.actividad || '',

Observaciones:
document.getElementById('txtObservaciones').value,

UsuarioCaptura:
sessionStorage.getItem('nombre'),

Estado:'Disponible',

Activo:'Si'

};

await fetch(API_URL,{

method:'POST',

body:JSON.stringify({

sheet:'EXPEDIENTES',
...expediente

})

});

alert('Expediente registrado');

bootstrap.Modal
.getInstance(document.getElementById('modalSalida'))
.hide();

cacheSistema.expedientes = [];

/* Elimina el cache del frontend */
cacheSmart.clear('expedientes');

/* Recargar desde el servidor */
await window.cargarExpedientes();

} // 🔥 ESTE CIERRE FALTABA

catch(error){

console.error(error);

}

finally{

guardandoExpediente = false;

}

}

window.cargarExpedientes = async function(){

try{

/* ==========================
USAR CACHE SI YA EXISTE
========================== */

if(
cacheSistema.expedientes &&
cacheSistema.expedientes.length > 0
){

renderizarExpedientes(
cacheSistema.expedientes
);

return cacheSistema.expedientes;

}

const response=
await fetch(
API_URL+'?sheet=EXPEDIENTES'
);

const texto=
await response.text();

console.log(
'RESPUESTA EXPEDIENTES:',
texto
);

/* convertir a JSON */

const datos=
JSON.parse(texto);

cacheSistema.expedientes=
datos;

renderizarExpedientes(
datos
);

return datos;

}
catch(error){

console.error(
'Error cargando expedientes:',
error
);

}

};
function renderizarExpedientes(datos){

const tbody =
document.getElementById('tbodyExpedientes');

if(!tbody)return;

/* limpiar una sola vez */
tbody.innerHTML='';

/* filtrar */
const activos =
datos.filter(e => e.Activo === "Si");

/* fragmento DOM (MUCHO más rápido) */
const fragment =
document.createDocumentFragment();

activos.forEach(exp=>{

const tr =
document.createElement('tr');

tr.innerHTML = `

<td>${exp.NumeroInterno||''}</td>
<td>${exp.NoExpediente||''}</td>
<td>${exp.PersonaResponsable||''}</td>
<td>${exp.Actividad||''}</td>
<td>${exp.UsuarioCaptura||''}</td>

<td>

<button
class="btn btn-primary btn-sm"
onclick="prestarExpediente(
'${exp.ID}',
'${exp.NumeroInterno}',
'${exp.NoExpediente}',
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Observaciones}',
'${exp.UsuarioCaptura}'
)">

Prestar

</button>

</td>

`;

fragment.appendChild(tr);

});

tbody.appendChild(fragment);

}

function filtrarExpedientes(){

    if(!cacheSistema?.expedientes) return;

    const datos = cacheSistema.expedientes;

    const texto =
        document.getElementById('filtroTextoExpediente')?.value.toLowerCase() || '';

    const responsable =
        document.getElementById('filtroResponsable')?.value || '';

    const estado =
        document.getElementById('filtroEstado')?.value || '';

    const filtrados = datos.filter(e => {

        let ok = true;

        if(texto){
            ok =
                (e.NumeroInterno||'').toLowerCase().includes(texto) ||
                (e.NoExpediente||'').toLowerCase().includes(texto) ||
                (e.PersonaResponsable||'').toLowerCase().includes(texto) ||
                (e.Actividad||'').toLowerCase().includes(texto);
        }

        if(responsable){
            ok = ok && e.PersonaResponsable === responsable;
        }

        if(estado){
            ok = ok && e.Estado === estado;
        }

        return ok;
    });

    renderizarExpedientes(filtrados);
}

function refrescarVistaExpedientes(){

    if(typeof filtrarExpedientes !== 'function') return;

    if(!cacheSistema?.expedientes) return;

    filtrarExpedientes();
}

/* si no, render normal */

function ordenarExpedientes(columna){

const datos =
cacheSistema.expedientes;

/* cambiar dirección si es la misma columna */
if(ordenExpedientes.columna === columna){
ordenExpedientes.asc = !ordenExpedientes.asc;
}else{
ordenExpedientes.columna = columna;
ordenExpedientes.asc = true;
}

const asc =
ordenExpedientes.asc;

/* copiar para no modificar original */
const ordenados = [...datos].sort((a,b)=>{

let valA = a[columna] || '';
let valB = b[columna] || '';

const numA = parseFloat(valA);
const numB = parseFloat(valB);

if(!isNaN(numA) && !isNaN(numB)){
return asc ? numA - numB : numB - numA;
}

valA = valA.toString().toLowerCase();
valB = valB.toString().toLowerCase();

if(valA < valB) return asc ? -1 : 1;
if(valA > valB) return asc ? 1 : -1;
return 0;

});

renderizarExpedientes(ordenados);

}

/* =======================
PRESTAR
======================= */

async function prestarExpediente(
id,
interno,
expediente,
responsable,
actividad,
observaciones,
usuarioCaptura
){

if(prestandoExpediente)return;

prestandoExpediente=true;

try{

const fecha = new Date().toISOString();

const prestado={

ID:Date.now(),

NumeroInterno:interno,
NoExpediente:expediente,
PersonaResponsable:responsable,
Actividad:actividad,

Estado:'Prestado',

FechaPrimerSalida:fecha,
FechaUltimoMovimiento:fecha,

Observaciones:observaciones,
UsuarioCaptura:usuarioCaptura,

Activo:'Si'

};

const movimiento={

ID:Date.now(),

NumeroInterno:interno,
NoExpediente:expediente,

TipoMovimiento:'Salida',

PersonaResponsable:responsable,
Actividad:actividad,

UsuarioSistema:
sessionStorage.getItem('nombre'),

FechaHora:fecha

};

await fetch(API_URL,{
method:'POST',
headers:{
'Content-Type':'text/plain;charset=utf-8'
},
body:JSON.stringify({

action:'PRESTAR_EXPEDIENTE',

IDExpediente:id,

ID:prestado.ID,

IDMovimiento:movimiento.ID,

NumeroInterno:interno,
NoExpediente:expediente,
    
PersonaResponsable:responsable,
Actividad:actividad,

FechaPrimerSalida:fecha,
FechaUltimoMovimiento:fecha,

Observaciones:observaciones,

UsuarioCaptura:usuarioCaptura,

UsuarioSistema:
sessionStorage.getItem('nombre'),

FechaHora:fecha

})

});
alert(
'Expediente prestado correctamente'
);

/* limpiar cache */
cacheSistema.expedientes=[];

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

}
catch(error){

console.error(error);

alert(
'Error al prestar expediente'
);

}
finally{

prestandoExpediente=false;

}

}

/* =======================
PRESTAR TODOS
======================= */

async function prestarTodosExpedientes(){

if(prestandoExpediente) return;


const expedientes =
cacheSistema.expedientes || [];


const disponibles =
expedientes.filter(e =>
    e.Activo === "Si"
);


if(disponibles.length===0){

    alert(
        "No existen expedientes disponibles para prestar."
    );

    return;

}


const confirmar =
confirm(
    "¿Desea prestar todos los expedientes disponibles?\n\nTotal: "
    + disponibles.length
);


if(!confirmar){

    return;

}


prestandoExpediente=true;


try{

const response = await fetch(API_URL,{
    method:"POST",
    headers:{
        "Content-Type":"text/plain;charset=utf-8"
    },
    body:JSON.stringify({
        action:"PRESTAR_TODOS_EXPEDIENTES",
        UsuarioSistema:sessionStorage.getItem("nombre")
    })
});

const texto = await response.text();

console.log("Respuesta RAW:", texto);

alert(texto);

return;

/* limpiar cache */

cacheSistema.expedientes=[];

cacheSmart.clear("expedientes");

/* recargar módulos */

await window.cargarExpedientes?.();

await window.cargarPrestados?.();

await window.cargarHistorico?.();

alert(

"Proceso terminado.\n\nExpedientes prestados: " +

(resultado.total || disponibles.length)

);


}
catch(error){

console.error(
"Error prestando todos:",
error
);


alert(
"Error al prestar todos los expedientes."
);


}
finally{


prestandoExpediente=false;


}


}

/* =======================
PRESTADOS
======================= */

async function cargarPrestados(){

const response=
await fetch(
API_URL+'?sheet=PRESTADOS'
);

const datos=
await response.json();

const tbody=
document.getElementById(
'tbodyPrestados'
);

tbody.innerHTML='';

datos.forEach(exp=>{

tbody.innerHTML+=`

<tr>

<td>${exp.NumeroInterno || ''}</td>
<td>${exp.NoExpediente || ''}</td>
<td>${exp.PersonaResponsable || ''}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="devolverExpediente(

'${exp.ID}',
'${exp.NumeroInterno}',
'${exp.NoExpediente}',
'${exp.PersonaResponsable}'

)">

Devolver

</button>

</td>

</tr>

`;

});

}

async function devolverExpediente(
id,
interno,
expediente,
responsable
){

if(devolviendoExpediente)return;

devolviendoExpediente=true;

try{

const fecha =
new Date().toISOString();

const movimiento={

ID:Date.now(),

NumeroInterno:interno,
NoExpediente:expediente,

TipoMovimiento:'Devolucion',

PersonaResponsable:responsable,

UsuarioSistema:
sessionStorage.getItem('nombre'),

FechaHora:fecha

};

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

sheet:'MOVIMIENTOS',
...movimiento

})

});

await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

action:'ELIMINAR_PRESTADO',
ID:id

})

});

alert(
'Expediente devuelto correctamente'
);

/* limpiar cache */
cacheSistema.expedientes=[];

await window.cargarExpedientes?.();
await window.cargarPrestados?.();
await window.cargarHistorico?.();

}
catch(error){

console.error(error);

}
finally{

devolviendoExpediente=false;

}

}

// ===============================
// CONTROL ORDEN HISTÓRICO
// ===============================

let historicoDatos = [];

let ordenHistorico = {
    columna: null,
    direccion: "asc"
};

/* ==========================
HISTORICO
========================== */

async function cargarHistorico(){

try{

const response=
await fetch(
API_URL+
'?sheet=MOVIMIENTOS'
);

const datos =
await response.json();

historicoDatos = datos;

const tbody =
document.getElementById(
'tbodyHistorico'
);

tbody.innerHTML='';

datos.reverse().forEach(mov=>{

let fecha='';

if(mov.FechaHora){

fecha=
new Date(
mov.FechaHora
)
.toLocaleString(
'es-MX',
{
timeZone:'America/Mexico_City',
day:'2-digit',
month:'2-digit',
year:'numeric',
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
hour12:true
}
);

}

tbody.innerHTML+=`

<tr>

<td>${fecha}</td>

<td>${mov.NumeroInterno||''}</td>

<td>${mov.NoExpediente||''}</td>

<td>${mov.TipoMovimiento||''}</td>

<td>${mov.PersonaResponsable||''}</td>

</tr>

`;

});

}
catch(error){

console.error(error);

}

}

// ===============================
// ===============================
// ORDENAR HISTÓRICO
// ===============================

function ordenarHistorico(columna){

if(!historicoDatos || historicoDatos.length===0){
return;
}


if(ordenHistorico.columna===columna){

ordenHistorico.direccion =
ordenHistorico.direccion==="asc"
? "desc"
: "asc";

}else{

ordenHistorico.columna=columna;
ordenHistorico.direccion="asc";

}


let datosOrdenados=[...historicoDatos];


datosOrdenados.sort((a,b)=>{

let valorA=a[columna] || "";
let valorB=b[columna] || "";


valorA=valorA.toString().toLowerCase();
valorB=valorB.toString().toLowerCase();


if(valorA<valorB){

return ordenHistorico.direccion==="asc"
? -1
: 1;

}


if(valorA>valorB){

return ordenHistorico.direccion==="asc"
? 1
: -1;

}


return 0;

});


mostrarHistorico(datosOrdenados);

}

function mostrarHistorico(datos){

const tbody=
document.getElementById(
'tbodyHistorico'
);


tbody.innerHTML='';


datos.forEach(mov=>{


let fecha='';


if(mov.FechaHora){

fecha=
new Date(
mov.FechaHora
)
.toLocaleString(
'es-MX',
{
timeZone:'America/Mexico_City',
day:'2-digit',
month:'2-digit',
year:'numeric',
hour:'2-digit',
minute:'2-digit',
second:'2-digit',
hour12:true
}
);

}


tbody.innerHTML+=`

<tr>

<td>${fecha}</td>

<td>${mov.NumeroInterno||''}</td>

<td>${mov.NoExpediente||''}</td>

<td>${mov.TipoMovimiento||''}</td>

<td>${mov.PersonaResponsable||''}</td>

</tr>

`;

});

}

// ===============================
// FILTRO HISTÓRICO
// ===============================

document.addEventListener(
"input",
function(e){

if(!e.target.classList.contains("filtroHistorico")){
return;
}


let filtros =
document.querySelectorAll(
".filtroHistorico"
);


let datosFiltrados =
historicoDatos.filter(mov=>{


return [...filtros].every(f=>{


let texto =
f.value
.toLowerCase()
.trim();


if(texto===""){
return true;
}


let campo =
f.dataset.columna;


return String(
mov[campo] || ""
)
.toLowerCase()
.includes(texto);


});


});


mostrarHistorico(datosFiltrados);


});

// ===============================
// EXPORTAR HISTÓRICO
// ===============================

function exportarHistorico(){

    if(!historicoDatos || historicoDatos.length===0){

        alert(
            "No existen registros para exportar."
        );

        return;

    }

    alert(
        "Exportación en construcción."
    );

}

function cargarSelectPersonas(){

return;

}

// ==========================================
// PRESTAR TODOS LOS EXPEDIENTES
// ==========================================

let prestandoTodos = false;

async function prestarTodosExpedientes(){

    if(prestandoTodos) return;

    if(
        !confirm(
            "¿Desea prestar TODOS los expedientes disponibles?"
        )
    ){
        return;
    }

    prestandoTodos = true;

    try{

        const response = await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify({

                action:"PRESTAR_TODOS_EXPEDIENTES",

                UsuarioSistema:
                sessionStorage.getItem("nombre")

            })

        });

        const resultado =
        await response.json();

        if(!resultado.ok){

            throw new Error(
                resultado.message ||
                "No fue posible prestar los expedientes."
            );

        }

        cacheSistema.expedientes = [];
        cacheSistema.prestados = [];
        cacheSistema.movimientos = [];

        await window.cargarExpedientes?.();
        await window.cargarPrestados?.();
        await window.cargarHistorico?.();

        alert(
            resultado.message ||
            "Todos los expedientes fueron prestados correctamente."
        );

    }
    catch(error){

        console.error(error);

        alert(
            error.message
        );

    }
    finally{

        prestandoTodos = false;

    }

}
