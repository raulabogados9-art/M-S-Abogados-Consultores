// ==========================================
// EXPORTAR HISTÓRICO
// M&S ABOGADOS CONSULTORES
// ==========================================

// ==========================================
// CARGAR LOGO
// ==========================================

async function cargarLogo(){

    try{

        const response = await fetch("imagenes/logo.png");

        if(!response.ok){

            throw new Error("No se pudo cargar el logo.");

        }

        const blob = await response.blob();

        return await new Promise((resolve)=>{

            const reader = new FileReader();

            reader.onload = function(event){

                resolve(event.target.result);

            };

            reader.readAsDataURL(blob);

        });

    }
    catch(error){

        console.error(
            "Error cargando el logo:",
            error
        );

        return null;

    }

}

// ==========================================
// CREAR ENCABEZADO DEL REPORTE
// ==========================================

function crearEncabezadoReporte(
    worksheet,
    usuario,
    totalRegistros
){

    // Agregar registros del histórico

historicoDatos.forEach(mov=>{


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


    worksheet.addRow([

        fecha,

        mov.NumeroInterno || '',

        mov.NoExpediente || '',

        mov.TipoMovimiento || '',

        mov.PersonaResponsable || ''

    ]);


});


console.log(
    "Registros agregados:",
    historicoDatos.length
);

    // Título principal
    worksheet.mergeCells("C2:G2");

    worksheet.getCell("C2").value =
        "M&S ABOGADOS CONSULTORES";

    worksheet.getCell("C2").font = {

        name:"Calibri",
        size:18,
        bold:true

    };

    worksheet.getCell("C2").alignment = {

        horizontal:"center"

    };


    // Subtítulo

    worksheet.mergeCells("C3:G3");

    worksheet.getCell("C3").value =
        "Sistema de Gestión de Expedientes";

    worksheet.getCell("C3").font = {

        name:"Calibri",
        size:12

    };

    worksheet.getCell("C3").alignment = {

        horizontal:"center"

    };


    // Nombre del reporte

    worksheet.mergeCells("C5:G5");

    worksheet.getCell("C5").value =
        "HISTÓRICO DE MOVIMIENTOS";

    worksheet.getCell("C5").font = {

        name:"Calibri",
        size:15,
        bold:true

    };

    worksheet.getCell("C5").alignment = {

        horizontal:"center"

    };


    // Usuario

    worksheet.getCell("B7").value =
        "Generado por:";

    worksheet.getCell("C7").value =
        usuario;


    // Fecha

    worksheet.getCell("B8").value =
        "Fecha:";

    worksheet.getCell("C8").value =
        new Date();


    worksheet.getCell("C8").numFmt =
        "dd/mm/yyyy hh:mm:ss";


    // Total

    worksheet.getCell("B9").value =
        "Total de movimientos:";

    worksheet.getCell("C9").value =
        totalRegistros;

}

// Ajustar columnas
function ajustarColumnas(){

}

// ==========================================
// EXPORTAR HISTÓRICO
// ==========================================

async function exportarHistorico(){

try{

    // Validar datos disponibles
    if(!historicoDatos || historicoDatos.length===0){

        alert("No hay datos históricos para exportar.");
        return;

    }


    // Crear libro Excel
    const workbook = new ExcelJS.Workbook();


    // Crear hoja
    const worksheet = workbook.addWorksheet(
        "HISTÓRICO"
    );


    // Crear encabezados
    crearEncabezadoReporte(
        worksheet
    );


    console.log(
        "Libro creado:",
        workbook
    );


    alert(
"Bloque 3 completado correctamente."
);


}catch(error){

    console.error(
        "Error exportando histórico:",
        error
    );

    alert(
        "Error en Bloque 2: "+
        error.message
    );

}

}

function crearEncabezadoReporte(worksheet){


    worksheet.addRow([

        "ID",
        "Número Interno",
        "Número Expediente",
        "Cliente",
        "Actividad",
        "Fecha",
        "Estado"

    ]);


}
