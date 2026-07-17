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

    if(
        !historicoDatos ||
        historicoDatos.length===0
    ){

        alert(
            "No existen registros para exportar."
        );

        return;

    }


    const workbook =
        new ExcelJS.Workbook();

    const worksheet =
        workbook.addWorksheet(
            "Histórico"
        );


    const usuario =
        sessionStorage.getItem(
            "nombre"
        ) || "Usuario";


    crearEncabezadoReporte(

        worksheet,

        usuario,

        historicoDatos.length

    );


    alert(
        "Bloque 1 completado correctamente."
    );

}
