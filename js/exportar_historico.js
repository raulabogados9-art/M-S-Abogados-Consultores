// ==========================================
// EXPORTAR HISTÓRICO
// M&S ABOGADOS CONSULTORES
// REPORTE PROFESIONAL XLSX V2 FINAL
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
// IDENTIDAD VISUAL M&S
// ==========================================

function crearEncabezadoReporte(
    worksheet,
    usuario,
    totalRegistros
){



    worksheet.getRow(1).height = 35;
    worksheet.getRow(2).height = 22;
    worksheet.getRow(3).height = 28;




    // ======================================
    // TITULO PRINCIPAL
    // ======================================


    worksheet.mergeCells(
        "B1:E1"
    );


    const titulo =
    worksheet.getCell("B1");



    titulo.value =
    "M&S ABOGADOS CONSULTORES";



    titulo.font={

        name:"Calibri",

        size:18,

        bold:true,

        color:{
            argb:"1F4E79"
        }

    };



    titulo.alignment={

        horizontal:"center",

        vertical:"middle"

    };







    // ======================================
    // SISTEMA
    // ======================================


    worksheet.mergeCells(
        "B2:E2"
    );


    const sistema =
    worksheet.getCell("B2");



    sistema.value =
    "Sistema de Gestión de Expedientes V2";



    sistema.font={

        name:"Calibri",

        size:12,

        italic:true,

        color:{
            argb:"666666"
        }

    };



    sistema.alignment={

        horizontal:"center",

        vertical:"middle"

    };







    // ======================================
    // TITULO REPORTE
    // ======================================


    worksheet.mergeCells(
        "A3:E3"
    );



    const reporte =
    worksheet.getCell("A3");



    reporte.value =
    "HISTÓRICO DE EXPEDIENTES";



    reporte.font={

        name:"Calibri",

        size:15,

        bold:true,

        color:{
            argb:"17365D"
        }

    };



    reporte.alignment={

        horizontal:"center",

        vertical:"middle"

    };



    reporte.border={

        bottom:{

            style:"medium",

            color:{
                argb:"1F4E79"
            }

        }

    };







    // ======================================
    // INFORMACIÓN REPORTE
    // ======================================


    worksheet.getCell("A5").value =
    "Generado por:";


    worksheet.getCell("B5").value =
    usuario || "";



    worksheet.getCell("A6").value =
    "Fecha del reporte:";



    worksheet.getCell("B6").value =
    new Date();



    worksheet.getCell("B6").numFmt =
    "dd/mm/yyyy";




    worksheet.getCell("A7").value =
    "Total movimientos:";



    worksheet.getCell("B7").value =
    totalRegistros || 0;






    [
        "A5",
        "A6",
        "A7"
    ]
    .forEach(function(celda){


        worksheet.getCell(celda).font={

            bold:true,

            color:{
                argb:"666666"
            }

        };


    });




    worksheet.addRow([]);




    worksheet.addRow([

        "Fecha",

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
            width:16
        },


        {
            width:20
        },


        {
            width:22
        },


        {
            width:28
        },


        {
            width:38
        }


    ];


}






// ==========================================
// FORMATO DE TABLA
// IDENTIDAD VISUAL M&S
// ==========================================

function aplicarFormatoTabla(
    worksheet
){


    const filaEncabezado = 9;


    const ultimaFila =
    worksheet.lastRow.number;




    // ======================================
    // ENCABEZADO TABLA
    // ======================================


    const encabezado =
    worksheet.getRow(
        filaEncabezado
    );



    encabezado.font={

        name:"Calibri",

        size:11,

        bold:true,

        color:{
            argb:"FFFFFF"
        }

    };



    encabezado.fill={



    encabezado.alignment={

        horizontal:"center",

        vertical:"middle",

        wrapText:true

    };



    encabezado.height=28;





    encabezado.eachCell(
        function(cell){


            cell.border={

                top:{
                    style:"thin"
                },


                left:{
                    style:"thin"
                },


                bottom:{
                    style:"thin"
                },


                right:{
                    style:"thin"
                }

            };


        }

    );







    // ======================================
    // DATOS
    // ======================================


    for(
        let i=filaEncabezado+1;
        i<=ultimaFila;
        i++
    ){


        const fila =
        worksheet.getRow(i);



        fila.height=22;



        fila.alignment={

            vertical:"middle",

            wrapText:true

        };





        fila.eachCell(
            function(cell){


                cell.border={

                    top:{
                        style:"thin"
                    },


                    left:{
                        style:"thin"
                    },


                    bottom:{
                        style:"thin"
                    },


                    right:{
                        style:"thin"
                    }

                };


            }

        );





        fila.getCell(1).alignment={

            horizontal:"center",

            vertical:"middle"

        };



        fila.getCell(2).alignment={

            horizontal:"center",

            vertical:"middle"

        };



        fila.getCell(3).alignment={

            horizontal:"center",

            vertical:"middle"

        };


    }



}






// ==========================================
// CONFIGURAR IMPRESIÓN
// ==========================================

function configurarImpresion(
    worksheet
){


    worksheet.pageSetup={


        orientation:
        "landscape",


        fitToPage:true,


        fitToWidth:1,


        fitToHeight:0


    };




    worksheet.pageMargins={


        left:0.25,

        right:0.25,

        top:0.50,

        bottom:0.50,

        header:0.20,

        footer:0.20


    };


}

// ==========================================
// EXPORTAR HISTÓRICO
// FUNCIÓN PRINCIPAL
// ==========================================

async function exportarHistorico(){


try{


    if(
        !historicoDatos ||
        historicoDatos.length===0
    ){


        alert(
            "No hay datos históricos para exportar."
        );


        return;


    }





    const workbook =
    new ExcelJS.Workbook();




    const worksheet =
    workbook.addWorksheet(
        "HISTÓRICO"
    );






    // ======================================
    // INSERTAR LOGO
    // ======================================


    const logo =
    await cargarLogo();



    if(logo){


        const logoId =
        workbook.addImage({

            base64:logo,

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







    // ======================================
    // CREAR ENCABEZADO
    // ======================================


    crearEncabezadoReporte(

        worksheet,

        sessionStorage.getItem(
            "nombre"
        ),

        historicoDatos.length

    );







    // ======================================
    // AGREGAR MOVIMIENTOS
    // ======================================


    historicoDatos.forEach(

        function(mov){


            let fecha="";



            if(mov.FechaHora){


                const fechaObj =
                new Date(
                    mov.FechaHora
                );



                fecha =
                fechaObj.toLocaleDateString(

                    "es-MX",

                    {

                        timeZone:
                        "America/Mexico_City"

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



        }

    );








    // ======================================
    // FORMATO FINAL
    // ======================================


    ajustarColumnas(
        worksheet
    );



    aplicarFormatoTabla(
        worksheet
    );



    configurarImpresion(
        worksheet
    );







    // ======================================
    // CONGELAR ENCABEZADO
    // ======================================


    worksheet.views=[


        {

            state:"frozen",

            ySplit:9

        }


    ];






    // ======================================
    // FILTRO
    // ======================================


    worksheet.autoFilter={


        from:"A9",

        to:"E9"


    };







    // ======================================
    // GENERAR ARCHIVO
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
    URL.createObjectURL(
        blob
    );





    const enlace =
    document.createElement(
        "a"
    );





    const fechaArchivo =

    new Date()

    .toISOString()

    .substring(

        0,

        10

    );






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

        "Histórico exportado correctamente."

    );



}
catch(error){



    console.error(

        "Error exportando histórico:",

        error

    );



    alert(

        "Error exportando histórico: " +

        error.message

    );



}


}
