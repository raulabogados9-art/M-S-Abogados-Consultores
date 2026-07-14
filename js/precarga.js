/* ==========================================
PRECARGA INTELIGENTE
========================================== */

window.precargarSistema = async function(){

try{

const tareas=[];

if(cacheSistema.personas.length===0){

tareas.push(cargarPersonas());

}

if(cacheSistema.actividades.length===0){

tareas.push(cargarActividades());

}

if(cacheSistema.usuarios.length===0){

tareas.push(cargarUsuarios());

}

await Promise.all(tareas);

console.log("Precarga completada");

}catch(e){

console.error(
"Error precarga:",
e
);

}

}
