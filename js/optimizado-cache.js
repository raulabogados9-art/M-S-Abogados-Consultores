/* =========================
CACHE INTELIGENTE GLOBAL
M&S OPTIMIZACIÓN
========================= */

window.cacheSmart = {

lock:false,

async get(key, loader){

// si ya existe data → no volver a pedir
if(this[key] && this[key].length>0){
return this[key];
}

// evitar doble fetch simultáneo
if(this.lock){
return new Promise(resolve=>{
setTimeout(()=>{
resolve(this.get(key,loader));
},300);
});
}

this.lock=true;

try{

const data = await loader();

this[key]=data;

return data;

}catch(error){

console.error('Error cacheSmart:',error);

return [];

}finally{

this.lock=false;

}

}

};
