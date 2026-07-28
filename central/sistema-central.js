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
        id:"personas",
        nombre:"Personas",
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


    activarMenu(
    enlace
    );


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
ACTIVAR MENU
========================== */


function activarMenu(
elemento
){


const enlaces =
document.querySelectorAll(
"#menuCentral a"
);



enlaces.forEach(
enlace=>{

    enlace.classList.remove(
    "activo"
    );

});


elemento.classList.add(
"activo"
);


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



switch(modulo.id){


case "dashboard":


vista.innerHTML = `

<h2>
Dashboard
</h2>

<p>
Panel principal del Sistema Central.
</p>

`;

break;



case "expedientes":


vista.innerHTML = `

<h2>
Expedientes
</h2>

<p>
Módulo de gestión de expedientes.
</p>

`;

break;



case "personas":


vista.innerHTML = `

<h2>
Personas
</h2>

<p>
Módulo de administración de personas.
</p>

`;

break;



case "reportes":


vista.innerHTML = `

<h2>
Reportes
</h2>

<p>
Módulo de reportes del sistema.
</p>

`;

break;



case "usuarios":


vista.innerHTML = `

<h2>
Usuarios
</h2>

<p>
Administración de usuarios y permisos.
</p>

`;

break;



case "bitacora":


vista.innerHTML = `

<h2>
Bitácora
</h2>

<p>
Registro de seguridad y auditoría.
</p>

`;

break;



default:


vista.innerHTML = `

<h2>
${modulo.nombre}
</h2>

<p>
Módulo no configurado.
</p>

`;



}


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
