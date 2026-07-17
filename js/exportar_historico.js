// ==========================================
// EXPORTAR HISTÓRICO
// M&S ABOGADOS CONSULTORES
// ==========================================


// ==========================================
// CARGAR LOGO
// ==========================================

async function cargarLogo(){

    try{

        const response =
        await fetch("imagenes/logo.png");


        if(!response.ok){

            throw new Error(
                "No se pudo cargar el logo."
            );

        }


        const blob =
        await response.blob();


        return await new Promise((resolve)=>{


            const reader =
            new FileReader();


            reader.onload=function(event){

                resolve(
                    event.target.result
                );

            };


            reader.readAsDataURL(blob);


        });


    }
    catch(error){

        console.error(
            "Error cargando logo:",
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

    worksheet.mergeCells(
        "A1:E1"
    );


    worksheet.getCell("A1").value =
    "M&S ABOGADOS CONSULTORES";


    worksheet.getCell("A1").font={

        name:"Calibri",
        size:18,
        bold:true

    };


    worksheet.getCell("A1").alignment={

        horizontal:"center"

    };




    // Subtítulo

    worksheet.mergeCells(
        "A2:E2"
    );


    worksheet.getCell("A2").value =
    "Sistema de Gestión de Expedientes";


    worksheet.getCell("A2").alignment={

        horizontal:"center"

    };




    // Nombre reporte

    worksheet.mergeCells(
        "A3:E3"
    );


    worksheet.getCell("A3").value =
    "HISTÓRICO DE MOVIMIENTOS";


    worksheet.getCell("A3").font={

        size:15,
        bold:true

    };


    worksheet.getCell("A3").alignment={

        horizontal:"center"

    };




    // Información del reporte


    worksheet.getCell("A5").value =
    "Generado por:";


    worksheet.getCell("B5").value =
    usuario || "";



    worksheet.getCell("A6").value =
    "Fecha:";


    worksheet.getCell("B6").value =
    new Date();



    worksheet.getCell("B6").numFmt =
    "dd/mm/yyyy hh:mm:ss";



    worksheet.getCell("A7").value =
    "Total movimientos:";



    worksheet.getCell("B7").value =
    totalRegistros || 0;




    // Encabezados tabla


    worksheet.addRow([]);



    worksheet.addRow([


        "Fecha y Hora",

        "Número Interno",

        "No. Expediente",

        "Tipo Movimiento",

        "Persona Responsable"


    ]);



}





// ==========================================
// AJUSTAR COLUMNAS
// ==========================================

function ajustarColumnas(
    worksheet
){


    worksheet.columns=[

        {
            width:25
        },

        {
            width:18
        },

        {
            width:22
        },

        {
            width:22
        },

        {
            width:30
        }

    ];


}





// ==========================================
// EXPORTAR HISTÓRICO
// ==========================================


async function exportarHistorico(){


try{

const logoPrueba = await cargarLogo();

console.log("Logo cargado:", logoPrueba);


    // Validar información


    if(
        !historicoDatos ||
        historicoDatos.length===0
    ){

        alert(
            "No hay datos históricos para exportar."
        );

        return;

    }




    // Crear libro


    const workbook =
    new ExcelJS.Workbook();




    const worksheet =
    workbook.addWorksheet(
        "HISTÓRICO"
    );

// Cargar logo
const logo = await cargarLogo();

if(logo){

    const logoId =
    workbook.addImage({

        base64: logo,

        extension:"png"

    });


    worksheet.addImage(

        logoId,

        {

            tl:{
                col:0,
                row:0
            },

            ext:{
                width:120,
                height:60
            }

        }

    );

}

    // Crear encabezado


    crearEncabezadoReporte(

        worksheet,

        sessionStorage.getItem("nombre"),

        historicoDatos.length

    );





    // ======================================
    // AGREGAR DATOS HISTÓRICOS
    // ======================================


    historicoDatos.forEach(mov=>{


        let fecha="";



        if(mov.FechaHora){


            fecha =
            new Date(
                mov.FechaHora
            )
            .toLocaleString(

                "es-MX",

                {

                    timeZone:
                    "America/Mexico_City",

                    day:"2-digit",

                    month:"2-digit",

                    year:"numeric",

                    hour:"2-digit",

                    minute:"2-digit",

                    second:"2-digit",

                    hour12:true

                }

            );


        }



        worksheet.addRow([


            fecha,


            mov.NumeroInterno || "",


            mov.NoExpediente || "",


            mov.TipoMovimiento || "",


            mov.PersonaResponsable || ""



        ]);



    });





    console.log(

        "Registros agregados:",

        historicoDatos.length

    );






    // ======================================
    // FORMATO
    // ======================================



    ajustarColumnas(
        worksheet
    );



    worksheet.views=[

        {

            state:"frozen",

            ySplit:9

        }

    ];




    worksheet.autoFilter={

        from:"A9",

        to:"E9"

    };




    const encabezado =
    worksheet.getRow(9);



    encabezado.font={

        bold:true

    };



    encabezado.alignment={

        horizontal:"center"

    };



    encabezado.height=25;






    // ======================================
    // CREAR ARCHIVO XLSX
    // ======================================



    const buffer =
    await workbook.xlsx.writeBuffer();





    const blob =
    new Blob(

        [

            buffer

        ],

        {

            type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        }

    );





    const url =
    URL.createObjectURL(blob);





    const enlace =
    document.createElement("a");





    const fechaArchivo =
    new Date()
    .toISOString()
    .substring(0,10);





    enlace.href=url;



    enlace.download =
    `Historico_Expedientes_${fechaArchivo}.xlsx`;





    document.body.appendChild(
        enlace
    );



    enlace.click();



    document.body.removeChild(
        enlace
    );



    URL.revokeObjectURL(
        url
    );





    alert(

        "Bloque 4 completado correctamente."

    );





}
catch(error){


    console.error(

        "Error exportando histórico:",

        error

    );



    alert(

        "Error exportando histórico: "+
        error.message

    );


}


}
