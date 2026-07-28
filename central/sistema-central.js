/* =====================================================
M&S SISTEMA CENTRAL V3.0
NÚCLEO PRINCIPAL
===================================================== */


/* ==========================
CONFIGURACIÓN DEL SISTEMA
========================== */


const sistemaCentral = {


    nombre:
    "M&S Sistema Central",


    empresa:
    "M&S Abogados Consultores",


    version:
    "3.0.0",


    moduloActual:
    "Dashboard",


    usuario:{

        nombre:
        "Usuario",

        rol:
        "Administrador"

    },


    modulos:[

        {
            id:"dashboard",
            nombre:"Dashboard",
            categoria:"OPERACIÓN"
        },


        {
            id:"expedientes",
            nombre:"Expedientes",
            categoria:"OPERACIÓN"
        },


        {
            id:"reportes",
            nombre:"Reportes",
            categoria:"OPERACIÓN"
        },


        {
            id:"usuarios",
            nombre:"Usuarios",
            categoria:"ADMINISTRACIÓN"
        },


        {
            id:"bitacora",
            nombre:"Bitácora",
            categoria:"SEGURIDAD"
        }


    ]


};



/* ==========================
INICIO DEL SISTEMA
========================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    inicializarSistema();


});





function inicializarSistema(){


    cargarUsuario();


    construirMenu();


    actualizarModulo(
    "Dashboard"
    );


}





/* ==========================
USUARIO
========================== */


function cargarUsuario(){


    document.getElementById(
    "nombreUsuario"
    ).textContent =
    sistemaCentral.usuario.nombre;



    document.getElementById(
    "rolUsuario"
    ).textContent =
    sistemaCentral.usuario.rol;


}





/* ==========================
MENU LATERAL
========================== */


function construirMenu(){


const menu =
document.getElementById(
"menuCentral"
);



menu.innerHTML="";



let categoriaActual="";



sistemaCentral.modulos.forEach(
modulo=>{


if(
modulo.categoria !== categoriaActual
){


categoriaActual =
modulo.categoria;


const titulo =
document.createElement(
"div"
);


titulo.className =
"titulo-menu";


titulo.textContent =
categoriaActual;



menu.appendChild(
titulo
);


}





const enlace =
document.createElement(
"a"
);



enlace.href="#";


enlace.textContent =
modulo.nombre;



enlace.onclick =
()=>{

    abrirModulo(
    modulo
    );

};



menu.appendChild(
enlace
);



});


}





/* ==========================
CAMBIO DE MODULO
========================== */


function abrirModulo(
modulo
){


actualizarModulo(
modulo.nombre
);



const vista =
document.getElementById(
"vistaCentral"
);



vista.innerHTML = `

<h2>
${modulo.nombre}
</h2>


<p>
Módulo preparado para integración.
</p>

`;



}





/* ==========================
ACTUALIZAR TITULOS
========================== */


function actualizarModulo(
nombre
){


sistemaCentral.moduloActual =
nombre;



document.getElementById(
"tituloModulo"
).textContent =
nombre;



document.getElementById(
"breadcrumbModulo"
).textContent =
nombre;



}
