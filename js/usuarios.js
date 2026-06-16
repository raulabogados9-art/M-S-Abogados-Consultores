let usuarios = [];

async function cargarUsuarios(){

try{

    const response =
    await fetch(
        API_URL + '?sheet=USUARIOS'
    );

    usuarios =
        await response.json();

    return usuarios;

}catch(error){

    console.error(error);

    return [];

}


}

async function cargarUsuariosTabla(){


await cargarUsuarios();

const tbody =
    document.getElementById(
        'tbodyUsuarios'
    );

if(!tbody) return;

tbody.innerHTML = '';

usuarios.forEach(usuario=>{

    const row =
        tbody.insertRow();

    row.insertCell(0).innerHTML =
        usuario.Usuario || '';

    row.insertCell(1).innerHTML =
        usuario.NombreCompleto || '';

    row.insertCell(2).innerHTML =
        usuario.Rol || '';

    row.insertCell(3).innerHTML =
        usuario.Activo || '';

});


}

function abrirModalUsuario(){

const modal =
    new bootstrap.Modal(
        document.getElementById(
            'modalUsuario'
        )
    );

modal.show();


}

async function guardarUsuario(){

alert(
    'Módulo en construcción'
);


}

async function cambiarEstadoUsuario(){

alert(
    'Módulo en construcción'
);

}
