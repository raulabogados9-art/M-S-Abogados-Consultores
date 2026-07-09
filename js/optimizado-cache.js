/* =========================
CACHE INTELIGENTE GLOBAL
M&S OPTIMIZACIÓN V3
========================= */

window.cacheSmart = {


memory:{},

locks:{},


TTL:
CONFIG_SISTEMA.CACHE.TTL,



/* =========================
VALIDAR SI EL MODULO USA CACHE
========================= */

usaCache(key){

if(!CONFIG_SISTEMA.CACHE.ACTIVO){

return false;

}


/*
Convierte:

personas
actividades
usuarios

a:

PERSONAS
ACTIVIDADES
USUARIOS
*/

const modulo =
key
.toUpperCase()
.replace(
"ACTIVIDADES",
"ACTIVIDADES"
);



return CONFIG_SISTEMA.PRECARGA[modulo] === true;

},



/* =========================
OBTENER DATOS
========================= */

async get(key,loader){


/*
Si el módulo NO usa cache:

Siempre consultar servidor
*/

if(!this.usaCache(key)){


console.log(
"🔵 Sin cache:",
key
);


return await loader();


}



/* =========================
CACHE MEMORIA
========================= */

if(
CONFIG_SISTEMA.CACHE.USAR_MEMORIA &&
this.memory[key]
){

const cache =
this.memory[key];


if(
Date.now()-cache.time
<
this.TTL
){

console.log(
"🟢 Cache memoria:",
key
);


return cache.data;

}

}



/* =========================
CACHE LOCALSTORAGE
========================= */

if(
CONFIG_SISTEMA.CACHE.USAR_LOCALSTORAGE
){


try{


const local =
localStorage.getItem(
"cache_"+key
);



if(local){


const cache =
JSON.parse(local);



if(
Date.now()-cache.time
<
this.TTL
){


this.memory[key]=cache;


console.log(
"🟢 Cache localStorage:",
key
);


return cache.data;


}



}



}
catch(error){

console.warn(
"Error localStorage cache",
error
);

}


}



/* =========================
EVITAR PETICIONES DUPLICADAS
========================= */


if(this.locks[key]){


return new Promise(resolve=>{


const esperar=()=>{


if(!this.locks[key]){


resolve(
this.get(
key,
loader
)
);


}else{


setTimeout(
esperar,
100
);


}


};


esperar();


});


}



this.locks[key]=true;



try{


const data =
await loader();



const cache={


data:data,

time:Date.now()


};



if(
CONFIG_SISTEMA.CACHE.USAR_MEMORIA
){


this.memory[key]=cache;


}




if(
CONFIG_SISTEMA.CACHE.USAR_LOCALSTORAGE
){


try{


localStorage.setItem(

"cache_"+key,

JSON.stringify(cache)

);


}
catch(e){}



}



console.log(
"🔵 Datos servidor:",
key
);



return data;



}
catch(error){


console.error(
"cacheSmart error:",
error
);


return [];


}
finally{


this.locks[key]=false;


}


},




/* =========================
LIMPIAR CACHE INDIVIDUAL
========================= */

clear(key){


delete this.memory[key];


try{


localStorage.removeItem(
"cache_"+key
);


}
catch(e){}



console.log(
"🗑 Cache eliminado:",
key
);


},




/* =========================
LIMPIAR TODO
========================= */

clearAll(){


this.memory={};



Object.keys(localStorage)

.filter(
k=>k.startsWith("cache_")
)

.forEach(
k=>localStorage.removeItem(k)
);



console.log(
"🗑 Todo cache eliminado"
);



}


};
