/* ==========================================================
   🔐 CONTROL DE ACCESO, SESIÓN Y SEGURIDAD MULTI-ÁREA
   M&S ABOGADOS CONSULTORES — NÚCLEO CORE V2
   ========================================================== */

let usuarioActual = null;

async function iniciarSesion() {
    const boton = document.getElementById('btnIngresar');
    const txtUser = document.getElementById('txtUsuario');
    const txtPass = document.getElementById('txtPassword');

    if (!txtUser || !txtPass) return;

    const user = txtUser.value.trim();
    const pass = txtPass.value.trim();

    if (!user || !pass) {
        alert('Por favor, introduzca sus credenciales de acceso.');
        return;
    }

    try {
        // Bloqueo visual del botón para evitar clics duplicados en el celular
        if (boton) {
            boton.disabled = true;
            boton.innerHTML = <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Validando...;
        }

        // 1️⃣ Consultar catálogo de usuarios (Protegido con caché inteligente)
        const usuarios = await cacheSmart.get('usuarios', async () => {
            const response = await fetch(${API_URL}?sheet=USUARIOS);
            return await response.json();
        });

        // Búsqueda estricta del usuario ignorando mayúsculas/minúsculas
        const validado = usuarios.find(u => 
            String(u.Usuario).trim().toLowerCase() === user.toLowerCase() && 
            String(u.Password).trim() === pass
        );

        if (!validado) {
            alert('Usuario o contraseña incorrectos. Verifique sus datos.');
            if (boton) {
                boton.disabled = false;
                boton.innerHTML = 'Ingresar';
            }
            return;
        }

        if (String(validado.Activo).trim().toUpperCase() !== 'SI') {
            alert('Esta cuenta se encuentra temporalmente suspendida. Contacte al administrador.');
            if (boton) {
                boton.disabled = false;
                boton.innerHTML = 'Ingresar';
            }
            return;
        }

        /* ==========================================================
           🏢 PERSISTENCIA DE SESIÓN CORPORATIVA AISLADA
           ========================================================== */
        usuarioActual = validado;
        sessionStorage.setItem('usuario', validado.Usuario);
        sessionStorage.setItem('nombreCompleto', validado.NombreCompleto);
        sessionStorage.setItem('rol', validado.Rol);
        
        // Asignación crucial del Departamento/Área para la segmentación de registros
        const areaAsignada = validado.Area || 'General';
        sessionStorage.setItem('area', areaAsignada);
        sessionStorage.setItem('DebeCambiarPassword', validado.DebeCambiarPassword || 'No');

        if (window.CONFIG_SISTEMA?.SISTEMA?.DEBUG) {
            console.log(🔐 Sesión Iniciada. Usuario: ${validado.Usuario} | Área: ${areaAsignada});
        }

        // 2️⃣ DISPARAR PRECARGA EN RÁFAGA PARALELA
        // Aprovecha el hardware de red del iPhone al máximo sin congelar la pantalla de carga
        if (typeof precargarSistema === 'function') {
            await precargarSistema();
        }

        // 3️⃣ REDIRECCIÓN OBLIGATORIA POR CAMBIO DE CLAVE TEMPORAL (RESET)
        if (validado.DebeCambiarPassword === 'Si') {
            const modalPass = new bootstrap.Modal(document.getElementById('modalCambioPassword'));
            modalPass.show();
            return;
        }

        // Flujo regular: Mostrar panel principal
        mostrarPantallaPrincipal();

    } catch (error) {
        console.error('Error crítico en el proceso de inicio de sesión:', error);
        alert('Error de conexión con el servidor. Revise su cobertura de datos.');
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.innerHTML = 'Ingresar';
        }
    }
}

function cerrarSesion() {
    // Purgar de inmediato la caché en RAM y LocalStorage para que otro usuario 
    // en el mismo dispositivo no pueda ver datos del área anterior por accidente.
    if (typeof cacheSmart !== 'undefined') {
        cacheSmart.clearAll();
    }
    
    sessionStorage.clear();
    usuarioActual = null;
    
    // Cambiar de vista (Manejo SPA tradicional)
    document.getElementById('pantallaLogin').style.display = 'block';
    document.getElementById('pantallaPrincipal').style.display = 'none';
    
    // Limpieza física de cajas de texto
    const txtUser = document.getElementById('txtUsuario');
    const txtPass = document.getElementById('txtPassword');
    if (txtUser) txtUser.value = '';
    if (txtPass) txtPass.value = '';
}

function verificarSesionActiva() {
    const usuarioLogueado = sessionStorage.getItem('usuario');
    if (usuarioLogueado) {
        mostrarPantallaPrincipal();
        // Si el usuario refresca la ventana por error, rehidratamos catálogos en paralelo de inmediato
        if (typeof precargarSistema === 'function') {
            precargarSistema();
        }
    } else {
        cerrarSesion();
    }
}

function mostrarPantallaPrincipal() {
    const loginView = document.getElementById('pantallaLogin');
    const mainView = document.getElementById('pantallaPrincipal');
    
    if (loginView) loginView.style.display = 'none';
    if (mainView) mainView.style.display = 'block';

    // Ajustes dinámicos en la barra de navegación según rol/área del empleado
    const userRole = sessionStorage.getItem('rol');
    const userArea = sessionStorage.getItem('area');
    
    const navAdmin = document.getElementById('navLinkAdmin');
    if (navAdmin) {
        navAdmin.style.display = (userRole === 'Administrador') ? 'block' : 'none';
    }

    // Inyectar etiquetas de bienvenida personalizadas en el Dashboard
    constlblUsuario = document.getElementById('lblNombreUsuarioSesion');
    if (lblUsuario) {
        lblUsuario.textContent = ${sessionStorage.getItem('nombreCompleto')} (${userArea});
    }
}

// Vinculación explícita al objeto global de ejecución del navegador
window.iniciarSesion = iniciarSesion;
window.cerrarSesion = cerrarSesion;
window.verificarSesionActiva = verificarSesionActiva;
