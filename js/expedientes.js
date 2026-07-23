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

const camposLimpiar = [
    "txtNoExpediente",
    "txtNumeroInterno",
    "txtActividad",
    "txtObservaciones"
];

camposLimpiar.forEach(id => {

    const campo = document.getElementById(id);

    if(campo){
        campo.value = "";
    }

});


// limpiar alerta estado expediente

const alertaEstado =
document.getElementById(
    "alertaEstadoExpediente"
);

if(alertaEstado){

    alertaEstado.style.display="none";
    alertaEstado.innerHTML="";

}

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

const numeroInterno =
document.getElementById('txtNumeroInterno');


if(numeroInterno){

numeroInterno.addEventListener(
'change',
buscarNumeroExpediente
);

}

/* forzar actualización inicial */
if(select.value){

actualizarActividadPersona();

}
    } catch (error) {
        console.error('Error en abrirModalExpediente:', error);
    }

    // 5. abrir modal
   const modalElement =
document.getElementById('modalSalida');


const modal =
bootstrap.Modal.getInstance(modalElement)
||
new bootstrap.Modal(modalElement);


modal.show();
}

async function buscarNumeroExpediente(){

const interno =
document.getElementById('txtNumeroInterno').value.trim();


if(!interno)return;


const response =
await fetch(
API_URL+'?sheet=CONTROL_EXPEDIENTES'
);


const datos =
await response.json();


const encontrado =
datos.find(
(x)=>x.NumeroInterno===interno
);


const campo =
document.getElementById('txtNoExpediente');


if(encontrado){

campo.value =
encontrado.NoExpediente;

campo.readOnly = true;

}
else{

campo.value='';

campo.readOnly = false;

}

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

Portal:
document.querySelector(
'input[name="portal"]:checked'
).value,

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

const modalElement =
document.getElementById('modalSalida');

const modal =
bootstrap.Modal.getInstance(modalElement);

if(modal){
    modal.hide();
}


// limpiar backdrop si quedó bloqueado

document
.querySelectorAll('.modal-backdrop')
.forEach(el=>el.remove());

document.body.classList.remove('modal-open');
document.body.style.overflow='';
document.body.style.paddingRight='';

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
<td>${exp.Portal||''}</td>
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
alert(
'Expediente devuelto correctamente'
);


/* limpiar cache */

cacheSistema.expedientes=[];
cacheSistema.prestados=[];
cacheSistema.historico=[];


/* actualizar solo módulos necesarios */

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

const textoRespuesta = await response.text();

console.log(
    "Respuesta RAW PRESTAR TODOS:",
    textoRespuesta
);

const resultado = JSON.parse(textoRespuesta);

console.log(
    "Respuesta JSON PRESTAR TODOS:",
    resultado
);


if(resultado.success){


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
else{


    alert(
        "No fue posible completar el proceso."
    );


}


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

const response =
await fetch(
API_URL + '?sheet=PRESTADOS'
);

const datos =
await response.json();

const tbody =
document.getElementById(
'tbodyPrestados'
);

tbody.innerHTML = '';

datos.forEach(exp=>{

tbody.innerHTML += `

<tr>

<td>${exp.NumeroInterno || ''}</td>
<td>${exp.NoExpediente || ''}</td>
<td>${exp.PersonaResponsable || ''}</td>
<td>${exp.Actividad || ''}</td>
<td>${exp.Portal || ''}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="devolverExpediente(
this,
'${exp.ID}',
'${exp.NumeroInterno}',
'${exp.NoExpediente}',
'${exp.PersonaResponsable}',
'${exp.Actividad}',
'${exp.Portal}',
'${exp.Observaciones || ""}'
)">

Devolver

</button>

</td>

</tr>

`;

});

}

async function devolverExpediente(
btn,
id,
interno,
expediente,
responsable,
actividad,
portal,
observaciones
){

if(devolviendoExpediente)return;

devolviendoExpediente=true;
btn.disabled=true;
btn.innerHTML="Procesando...";

try{

const fecha =
new Date().toISOString();


await fetch(API_URL,{

method:'POST',

headers:{
'Content-Type':'text/plain;charset=utf-8'
},

body:JSON.stringify({

action:'DEVOLVER_EXPEDIENTE',

ID:id,

NumeroInterno:interno,

NoExpediente:expediente,

PersonaResponsable:responsable,

Actividad:actividad,

Portal:portal,

IDMovimiento:
Date.now(),

UsuarioSistema:
sessionStorage.getItem('nombre'),

FechaHora:fecha,

Observaciones:
observaciones || ""

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

alert(
'No fue posible devolver el expediente'
);

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

<td>${mov.NumeroInterno || ''}</td>

<td>${mov.NoExpediente || ''}</td>

<td>${mov.TipoMovimiento || ''}</td>

<td>${mov.PersonaResponsable || ''}</td>

<td>${mov.Actividad || ''}</td>

<td>${mov.Portal || ''}</td>

<td>${mov.UsuarioSistema || ''}</td>

<td>${mov.Observaciones || ''}</td>

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

       if(!resultado.success){

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
    "Proceso terminado correctamente.\n\n" +
    "Expedientes prestados: " +
    (resultado.total || 0)
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

// ==========================================
// BUSCAR CONTROL EXPEDIENTE POR NUMERO INTERNO
// ==========================================

async function buscarControlExpediente(){

    const numeroInterno =
    document.getElementById(
        "txtNumeroInterno"
    ).value.trim();


    if(!numeroInterno){

        return;

    }


    try{


        const response =
        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"text/plain;charset=utf-8"
            },

            body:JSON.stringify({

                action:"BUSCAR_CONTROL_EXPEDIENTE",

                NumeroInterno:numeroInterno

            })

        });



        const resultado =
        await response.json();



        console.log(
            "Respuesta CONTROL EXPEDIENTE:",
            resultado
        );



        if(resultado.success){


            document.getElementById(
                "txtNoExpediente"
            ).value =
            resultado.NoExpediente;



            mostrarEstadoExpediente(
                resultado.Estado
            );


        }
        else{


            mostrarEstadoExpediente(
                "NO ENCONTRADO"
            );


        }



    }
    catch(error){


        console.error(
            "Error buscando control expediente:",
            error
        );


    }


}

// ==========================================
// MOSTRAR ESTADO EXPEDIENTE
// ==========================================

function mostrarEstadoExpediente(estado){


    const alerta =
    document.getElementById(
        "alertaEstadoExpediente"
    );


    if(!alerta){

        return;

    }


    alerta.style.display="block";


    const estadoTexto =
    String(estado).toUpperCase();



    if(estadoTexto==="ACTIVO"){


        alerta.style.background="#d4edda";
        alerta.style.color="#155724";

        alerta.innerHTML=
        "✔ EXPEDIENTE ACTIVO";


    }
    else if(estadoTexto==="CONCLUIDO"){


        alerta.style.background="#f8d7da";
        alerta.style.color="#721c24";

        alerta.innerHTML=
        "⚠ EXPEDIENTE CONCLUIDO";


    }
    else{


        alerta.style.background="#fff3cd";
        alerta.style.color="#856404";

        alerta.innerHTML=
        "⚠ EXPEDIENTE NO ENCONTRADO";


    }


}
