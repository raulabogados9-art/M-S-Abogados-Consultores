/* =========================
CACHE INTELIGENTE GLOBAL
M&S OPTIMIZACIÓN V2
========================= */

window.cacheSmart = {

memory:{},
locks:{},
TTL: CONFIG_SISTEMA.CACHE.TTL,

async get(key, loader){

// ---------- CACHE EN MEMORIA ----------
if(
CONFIG_SISTEMA.CACHE.USAR_MEMORIA &&
this.memory[key]
){
const cache=this.memory[key];

if(Date.now()-cache.time < this.TTL){

console.log("🟢 Cache memoria:",key);

return cache.data;

}

}

// ---------- CACHE LOCALSTORAGE ----------
if(CONFIG_SISTEMA.CACHE.USAR_LOCALSTORAGE){

try{

const local=localStorage.getItem("cache_"+key);

if(local){

const cache=JSON.parse(local);

if(Date.now()-cache.time < this.TTL){

this.memory[key]=cache;

console.log("🟢 Cache localStorage:",key);

return cache.data;

}

}

}

catch(e){
console.warn(e);
  }

}

// ---------- EVITAR DOBLE FETCH ----------
if(this.locks[key]){

return new Promise(resolve=>{

const esperar=()=>{

if(!this.locks[key]){

resolve(this.get(key,loader));

}else{

setTimeout(esperar,100);

}

};

esperar();

});

}

this.locks[key]=true;

try{

const data=await loader();

const cache={

data:data,
time:Date.now()

};

if(CONFIG_SISTEMA.CACHE.USAR_MEMORIA){

    this.memory[key]=cache;

}

try{
if(CONFIG_SISTEMA.CACHE.USAR_LOCALSTORAGE){

try{

localStorage.setItem(
"cache_"+key,
JSON.stringify(cache)
);

}catch(e){}

}

}catch(e){}

console.log("🔵 Datos desde servidor:",key);

return data;

}
catch(error){

console.error("cacheSmart:",error);

return [];

}
finally{

this.locks[key]=false;

}

},

clear(key){

delete this.memory[key];

localStorage.removeItem("cache_"+key);

console.log("🗑 Cache eliminado:",key);

},

clearAll(){

this.memory={};

Object.keys(localStorage)

.filter(k=>k.startsWith("cache_"))

.forEach(k=>localStorage.removeItem(k));

console.log("🗑 Todo el cache eliminado");

}

};
