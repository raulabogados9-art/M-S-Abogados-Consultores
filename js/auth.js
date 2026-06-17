async function cargarUsuarios() {

    const response = await fetch(
        API_URL + '?sheet=USUARIOS'
    );

    usuarios = await response.json();

    return usuarios;
}

async function login() {

    const usuario =
        document
        .getElementById('txtUsuario')
        .value
        .trim();

    const password =
        document
        .getElementById('txtPassword')
        .value
        .trim();

    await cargarUsuarios();

    const encontrado =
        usuarios.find(u =>
            u.Usuario === usuario &&
            u.Password === password &&
            u.Activo === 'Si'
        );

    if(!encontrado){

        alert(
            'Usuario o contraseña incorrectos'
        );

        return;
    }

    sessionStorage.setItem(
    'usuario',
    encontrado.Usuario
);

sessionStorage.setItem(
    'nombre',
    encontrado.NombreCompleto
);

sessionStorage.setItem(
    'rol',
    encontrado.Rol
);

document.getElementById(
    'loginContainer'
).style.display = 'none';

document.getElementById(
    'mainContainer'
).style.display = 'block';

document.getElementById(
    'lblUsuario'
).innerHTML =
encontrado.NombreCompleto +
' (' +
encontrado.Rol +
')';

document.getElementById(
    'lblUsuarioSistema'
).innerHTML =
encontrado.NombreCompleto;

cargarExpedientes();
cargarPrestados();
cargarHistorico();

if(encontrado.Rol === 'Administrador'){

    cargarUsuariosTabla();

}


// CONTROL DE MENÚS POR ROL

if(encontrado.Rol !== 'Administrador'){

    document.getElementById(
        'menuUsuarios'
    ).style.display = 'none';

    document.getElementById(
        'menuPersonas'
    ).style.display = 'none';

    document.getElementById(
        'menuActividades'
    ).style.display = 'none';

}

}

function logout(){

    sessionStorage.clear();

    location.reload();

}

function mostrarModulo(id){

    const modulos = [
        'expedientes',
        'prestados',
        'historico',
        'personas',
        'actividades',
        'usuarios'
    ];

    modulos.forEach(modulo => {

        document
            .getElementById(modulo)
            .style.display = 'none';

    });

    document
        .getElementById(id)
        .style.display = 'block';

    if(id === 'prestados'){
        cargarPrestados();
    }

    if(id === 'historico'){
        cargarHistorico();
    }

}
