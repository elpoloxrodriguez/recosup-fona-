import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { UtilService } from '../util/util.service';
import { ConvertNumberService } from '../util/convert-number.service'

@Injectable({
  providedIn: 'root'
})
export class PdfService {


  public comentario_title
  public porc_aporte
  public porc_aporte1
  public porc_aporte2
  public numero_formato
  public siglas_formato
  public comentario_text

  public margenLargo

  public monto
  constructor(
    private utilService: UtilService,
    private convertNumberService: ConvertNumberService
  ) { }

  DatosEmpresa() {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE DATOS DE EMPRESA FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`DATOS DEL SUJETO PASIVO`, pageWidth / 2, pageHeight - 250, { maxWidth: 150, align: "center" });


    doc.save("Datos-Empresa.pdf");
  }

  CertificadoDeclaracion(data: any, Qr: any, TokenQr: any) {
    // console.log(data)
    let articulo
    const fecha = new Date(data.FechaDesde ? data.FechaDesde : null);
    const anioDeclaracion = fecha.getFullYear();
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE DECLARACIÓN FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    // if (data.ActividadEconomicaId == '11' || data.ActividadEconomicaId == '60') {
    //   this.porc_aporte1 = 'Art.34';
    //   this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
    //   this.porc_aporte2 = 'al Aporte del (2%)';
    //   this.siglas_formato = 'CDCE';
    //   this.numero_formato = '003';
    //   this.comentario_title = 'DE LA DECLARACIÓN DE LA CONTRIBUCIÓN ESPECIAL';
    // } else {
    //   this.porc_aporte1 = 'Art.32';
    //   this.porc_aporte = 'de la declaración del Aporte (Art.32)';
    //   this.porc_aporte2 = 'al Aporte del (1%)';
    //   this.siglas_formato = 'CDA';
    //   this.numero_formato = '002';
    //   this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
    // } if (data.FECHA_MODIFICO > data.FECHA_CREO) {
    //   this.comentario_text `y modificado en fecha ${data.FECHA_MODIFIC}`;
    // } else {
    //   this.comentario_text = '';
    // }

    switch (data.Articulo) {
      case '32':
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de la declaración del Aporte (Art.32)';
        this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
        break;
      case '34':
        articulo = 'Art. 34'
        this.porc_aporte1 = 'Art.34';
        this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
        this.comentario_title = 'DE LA DECLARACIÓN DE CONTRIBUCIÓN ESPECIAL';
        break;
      default:
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de la declaración del Aporte (Art.32)';
        this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
        break;
    }

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${anioDeclaracion} -FONA-RECOSUP-${data.EmpresaId}-${data.EmpresaGananciaId}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO ${this.comentario_title + ' (' + this.porc_aporte1 + ')'}  A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la recepción de la DECLARACIÓN del contribuyente ${data.RazonSocial} RIF ${data.Rif}, realizada en fecha ${data.FECHA_CREO_GANANCIA}, por la cantidad de Bs. ${this.utilService.ConvertirMoneda(data.MONTO)} , ante el Fondo Nacional Antidrogas, correspondiente al período desde ${data.FechaDesde} hasta el ${data.FechaHasta}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de la declaración a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de declaración certifica la recepción del pago en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Certificado-de-Declaracion.pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }

  CertificadoInscripcion(data: any, Qr: any, TokenQr: any) {
    console.log(data, Qr, TokenQr)
    let articulo = ''
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE INSCRIPCIÓN FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${data.EmpresaId}-FONA-RECOSUP-${TokenQr}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("CERTIFICADO DE INSCRIPCIÓN ANTE EL FONDO NACIONAL ANTIDROGAS", pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 9 numeral 2 de la Providencia Administrativa 001-2015 de fecha 29 de julio de 2015, publicada en Gaceta Oficial N° 40.777 de fecha 29 de octubre de 2015, CERTIFICA la inscripción del Contribuyente: ${data.RazonSocial},Domicilio Fiscal: ${data.Direccion} (${data.Ciudad}),  identificado bajo el N° de R.I.F: ${data.Rif} , en el Sistema de Registro y Control de Sujetos Pasivos del FONA, según formulario electrónico N°: ${data.EmpresaId}-FONA-RECOSUP-${TokenQr}, procesado en fecha ${this.utilService.FechaMomentL(data.FechaCreo)}, siendo su actividad económica: ${data.ActividadEconomica}.`,
      14,
      110,
      { maxWidth: 185, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de inscripción ante el Sistema de Registro y Control de Sujetos Pasivos del Fondo Nacional Antidrogas.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Certificado-de-Inscripcion.pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }

  GenerarCertificadoAportes(data: any, Qr: any, TokenQr: any, dataRow: any) {
    // console.log(dataRow)
    // console.log(data)
    let articulo = ''
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE APORTE FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    // if (data.ActividadEconomica == 11 && data.ActividadEconomica == 60) {
    //   this.porc_aporte1 = 'Art.34';
    //   this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
    //   this.porc_aporte2 = 'al Aporte del (2%)';
    //   this.siglas_formato = 'CDCE';
    //   this.numero_formato = '003';
    //   this.comentario_title = 'DE LA DECLARACIÓN DE LA CONTRIBUCIÓN ESPECIAL';
    // } else {
    //   this.porc_aporte1 = 'Art.32';
    //   this.porc_aporte = 'de la declaración del Aporte (Art.32)';
    //   this.porc_aporte2 = 'al Aporte del (1%)';
    //   this.siglas_formato = 'CDA';
    //   this.numero_formato = '002';
    //   this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
    // } if (data.FECHA_MODIFICO > data.FECHA_CREO) {
    //   this.comentario_text `y modificado en fecha ${data.FECHA_MODIFIC}`;
    // } else {
    //   this.comentario_text = '';
    // }

    switch (dataRow.Articulo) {
      case '32':
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de pago del Aporte (Art.32)';
        this.comentario_title = 'DE PAGO DEL APORTE';
        break;
      case '34':
        articulo = 'Art. 34'
        this.porc_aporte1 = 'Art.34';
        this.porc_aporte = 'de pago Contribución Especial (Art.34)';
        this.comentario_title = 'DE PAGO CONTRIBUCIÓN ESPECIAL';
        break;
      default:
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de pago del Aporte (Art.32)';
        this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
        break;
    }

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${dataRow.FechaAporte} -FONA-RECOSUP-${dataRow.ReferenciaBancaria}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO ${this.comentario_title + ' (' + this.porc_aporte1 + ')'}  A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la creación del aporte en la fecha ${dataRow.FechaDocumento} y la recepción del PAGO del contribuyente ${data.RazonSocial} RIF ${data.Rif}, realizada en fecha ${dataRow.FechaBancoPago ? dataRow.FechaBancoPago : '      '}, correspondiente al período fiscal ${dataRow.FechaAporte}  por la cantidad de Bs. ${dataRow.Monto} , en el Banco ${dataRow.Banco}  bajo el numero de referencia #${dataRow.ReferenciaBancaria}, ante el Fondo Nacional Antidrogas, correspondiente al período desde ${this.utilService.FechaMomentL(dataRow.FechaDesde)} hasta el ${this.utilService.FechaMomentL(dataRow.FechaHasta)}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de pago contribución especial a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de pago certifica la recepción del mismo en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Cerftificado-de-Aporte.pdf");
    doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }

  GenerarFichaResumenProyecto(data: any) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: `${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf`,
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    // this.monto = 339257950.57;


    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    // doc.addImage(Qr, "PNG", 170, 255, 30, 30);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`FORMATO PARA LA PRESENTACIÓN DE`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    if (data.ambito_nombre != 'PTRRS') {
      this.margenLargo = 265
    } else {
      this.margenLargo = 259
    }
    doc.text(`${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre})`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`POR PARTE DE ORGANISMOS E INSTITUCIONES`, pageWidth / 2, pageHeight - this.margenLargo, { maxWidth: 150, align: "center" });


    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 45, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS GENERALES', pageWidth / 2, pageHeight - 245, { maxWidth: 190, align: "center" });

    doc.rect(10, 55, 70, 10, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Nro # RIF', 35, pageHeight - 235);

    // doc.rect(10, 60, 70, 5, 'S');

    doc.rect(10, 65, 70, 10, 'S');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('G-20009057-0', 30, pageHeight - 225);

    doc.rect(80, 55, 120, 10, 'S');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Nombre del Organismo o Institución', 140, pageHeight - 235, { maxWidth: 190, align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('OFICINA NACIONAL ANTIDROGAS', 140, pageHeight - 225, { maxWidth: 190, align: "center" });
    doc.rect(80, 65, 120, 10, 'S');



    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 75, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('REPRESENTANTE DEL PROYECTO', pageWidth / 2, pageHeight - 215, { maxWidth: 190, align: "center" });
    doc.rect(10, 85, 65, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('TELÉFONOS CONTACTO', 42, pageHeight - 205, { maxWidth: 65, align: "center" });
    doc.rect(75, 85, 125, 10, 'S');
    doc.setFontSize(7);
    doc.text('NOMBRE:', 81, pageHeight - 210, { maxWidth: 125, align: "center" });
    doc.setFontSize(10);
    doc.text(data.nombre_representante, 138, pageHeight - 205, { maxWidth: 125, align: "center" });



    doc.rect(10, 95, 65, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.telefono_representante, 42, pageHeight - 195, { maxWidth: 65, align: "center" });
    doc.rect(75, 95, 125, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('CORREO ELECTRONICO:', 90, pageHeight - 199, { maxWidth: 125, align: "center" });
    doc.setFontSize(9);
    doc.text(data.email_representante, 138, pageHeight - 195, { maxWidth: 125, align: "center" });




    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 105, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL PROYECTO', pageWidth / 2, pageHeight - 185, { maxWidth: 190, align: "center" });
    doc.rect(10, 105, 190, 30, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('NOMBRE DEL PROYECTO:', 11, 118);
    doc.rect(10, 135, 190, 30, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.nombre_proyecto.toUpperCase(), 11, pageHeight - 175, { maxWidth: 188, align: "justify" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    if (data.monto_financiamiento != 0.00 && data.monto_financiamiento != undefined) {
      doc.text(`${data.detalle_financiamiento}, ${data.monto_financiamiento}`, 11, pageHeight - 157, { maxWidth: 188, align: "justify" });
    }

    doc.rect(10, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('TIEMPO DE EJECUCIÓN', 17, 171);
    doc.setFontSize(10);
    doc.text(`DESDE: ${this.utilService.FechaMomentL(data.tiempo_ejecucion_desde)}`, 33, pageHeight - 112, { maxWidth: 47, align: "center" });
    doc.text(`HASTA: ${this.utilService.FechaMomentL(data.tiempo_ejecucion_hasta)}`, 33, pageHeight - 108, { maxWidth: 47, align: "center" });

    doc.rect(57.5, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('AREA', 78, 171);
    doc.text(data.nombre_area.toUpperCase(), 81, pageHeight - 119, { maxWidth: 47, align: "center" });


    doc.rect(105, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('BENEFICIARIOS DIRECTOS', 110, 171);

    doc.rect(152.5, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('BENEFICIARIOS INDIRECTOS', 157, 171);



    doc.rect(57.5, 175, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(data.ambito_descripcion.toUpperCase(), 81, pageHeight - 109, { maxWidth: 47, align: "center" });

    doc.rect(10, 175, 47.5, 20, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.beneficiario_directos, 129, pageHeight - 117, { maxWidth: 47, align: "center" });

    doc.rect(105, 175, 47.5, 20, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.beneficiario_indirectos, 176, pageHeight - 117, { maxWidth: 47, align: "center" });


    doc.rect(152.5, 175, 47.5, 20, 'S');




    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 195, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTO DEL PROYECTO', pageWidth / 2, pageHeight - 95, { maxWidth: 100, align: "center" });
    doc.rect(10, 205, 100, 20, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(this.convertNumberService.convertNumberToWords(data.monto_inversionX), 11, pageHeight - 88, { maxWidth: 98, align: "justify" });

    doc.rect(110, 205, 90, 20, 'S');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(data.monto_inversion, 155, pageHeight - 82, { maxWidth: 190, align: "center" });



    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 225, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL REGISTRO ANTE LA SUNAD (Art. 30 LOD)', pageWidth / 2, pageHeight - 65, { maxWidth: 190, align: "center" });
    doc.rect(10, 235, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('NRO# DE REGISTRO Y FECHA', 60, pageHeight - 55, { maxWidth: 95, align: "center" });
    doc.rect(10, 245, 95, 20, 'S');
    // 
    doc.rect(105, 235, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Nombre de la Institución, Persona Natural o Comité de Prevención Integral', 152, pageHeight - 57, { maxWidth: 95, align: "center" });
    doc.rect(105, 245, 95, 20, 'S');


    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text('________________________________________', pageWidth / 2, pageHeight - 15, { maxWidth: 150, align: "center" });
    doc.text(`Firma del Representante del Proyecto y Sello`, pageWidth / 2, pageHeight - 10, { maxWidth: 150, align: "center" });

    // doc.setFontSize(9);
    // doc.setFont(undefined, "bold");
    // doc.text(TokenQr,
    //   175,
    //   285,
    // );


    doc.save(`${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf`);
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: `${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf` });

  }

  GenerarFichaResumenProyectoLaboral(data: any, empresa: any) {
    console.log(empresa)
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: `${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf`,
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    // this.monto = 339257950.57;


    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    // doc.addImage(Qr, "PNG", 170, 255, 30, 30);

    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`FORMATO PARA LA PRESENTACIÓN DE`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    if (data.ambito_nombre != 'PTRRS') {
      this.margenLargo = 265
    } else {
      this.margenLargo = 259
    }
    doc.text(`${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre})`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`POR PARTE DE ORGANISMOS E INSTITUCIONES`, pageWidth / 2, pageHeight - this.margenLargo, { maxWidth: 150, align: "center" });


    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 45, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DE LA EMPRESA', pageWidth / 2, pageHeight - 245, { maxWidth: 190, align: "center" });

    doc.rect(10, 55, 40, 10, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.Rif ? data.Rif : 'N/A', 30, pageHeight - 235, { maxWidth: 190, align: "center" });

    doc.rect(50, 55, 150, 10, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(data.RazonSocial ? data.RazonSocial.toUpperCase() : 'N/A', 125, pageHeight - 235, { maxWidth: 190, align: "center" });



    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Dirección: ', 20, pageHeight - 228, { maxWidth: 190, align: "center" });
    doc.text(data.Direccion ? data.Direccion.toUpperCase() : 'N/A', 10, pageHeight - 225, { maxWidth: 189, align: "justify" });
    doc.rect(10, 65, 190, 20, 'S');

    doc.rect(10, 85, 63.3, 10, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Estado: ', 10, pageHeight - 209);
    doc.text(data.estado ? data.estado.toUpperCase() : 'N/A', 10, pageHeight - 204, { maxWidth: 63, align: "justify" });
    doc.rect(73.3, 85, 63.3, 10, 'S');
    doc.text('Municipio: ', 73.3, pageHeight - 209);
    doc.text(data.municipio ? data.municipio.toUpperCase() : 'N/A', 75, pageHeight - 204, { maxWidth: 63, align: "justify" });
    doc.rect(136.6, 85, 63.3, 10, 'S');
    doc.text('Parroquia: ', 136.6, pageHeight - 209);
    doc.text(data.parroquia ? data.parroquia.toUpperCase() : 'N/A', 138, pageHeight - 204, { maxWidth: 63, align: "justify" });

    doc.rect(10, 95, 190, 10, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Actividad Economica de la Empresa: ', 10, pageHeight - 199);
    doc.text(data.actividad_economica ? data.actividad_economica : 'N/A', 105, pageHeight - 196, { maxWidth: 190, align: "center" });

    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 105, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL REPRESENTANTE', pageWidth / 2, pageHeight - 185, { maxWidth: 190, align: "center" });
    doc.rect(10, 115, 65, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('TELÉFONOS CONTACTO', 25, pageHeight - 179, { maxWidth: 65, align: "center" });
    doc.setFontSize(10);
    doc.text(`${data.RepresentanteTelefono ? data.RepresentanteTelefono : 'N/A'} - ${data.RepresentanteCelular ? data.RepresentanteCelular : 'N/A'}`, 45, pageHeight - 175, { maxWidth: 65, align: "center" });
    doc.rect(75, 115, 125, 10, 'S');
    doc.setFontSize(7);
    doc.text('NOMBRE:', 81, pageHeight - 179, { maxWidth: 125, align: "center" });
    doc.setFontSize(10);
    doc.text(`${data.RepresentanteNombre ? data.RepresentanteNombre.toUpperCase() : 'N/A'} ${data.RepresentanteApellido ? data.RepresentanteApellido.toUpperCase() : 'N/A'}`, 138, pageHeight - 175, { maxWidth: 125, align: "center" });

    doc.rect(10, 125, 65, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('CARGO', 15, pageHeight - 169, { maxWidth: 65, align: "center" });
    doc.setFontSize(10);
    doc.text(data.RepresentanteCargo ? data.RepresentanteCargo : 'N/A', 40, pageHeight - 165, { maxWidth: 65, align: "center" });
    doc.rect(75, 125, 125, 10, 'S');
    doc.setFontSize(7);
    doc.text('CORREO ELECTRONICO:', 90, pageHeight - 169, { maxWidth: 125, align: "center" });
    doc.setFontSize(10);
    doc.text(data.RepresentanteEmail ? data.RepresentanteEmail : 'N/A', 135, pageHeight - 165, { maxWidth: 125, align: "center" });


    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 135, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DEL PROYECTO', pageWidth / 2, pageHeight - 155, { maxWidth: 190, align: "center" });
    doc.rect(10, 145, 190, 30, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('NOMBRE DEL PROYECTO:', 11, 148);
    // doc.rect(10, 135, 190, 30, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.nombre_proyecto.toUpperCase(), 11, pageHeight - 145, { maxWidth: 188, align: "justify" });


    doc.rect(10, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('TIEMPO DE EJECUCIÓN', 17, 171);
    doc.setFontSize(10);
    doc.text(`DESDE: ${this.utilService.FechaMomentL(data.tiempo_ejecucion_desde)}`, 33, pageHeight - 112, { maxWidth: 47, align: "center" });
    doc.text(`HASTA: ${this.utilService.FechaMomentL(data.tiempo_ejecucion_hasta)}`, 33, pageHeight - 108, { maxWidth: 47, align: "center" });

    doc.rect(57.5, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('AREA', 78, 171);
    doc.text(data.nombre_area.toUpperCase(), 81, pageHeight - 119, { maxWidth: 47, align: "center" });


    doc.rect(105, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('BENEFICIARIOS DIRECTOS', 110, 171);

    doc.rect(152.5, 165, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text('BENEFICIARIOS INDIRECTOS', 157, 171);



    doc.rect(57.5, 175, 47.5, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(data.ambito_descripcion.toUpperCase(), 81, pageHeight - 109, { maxWidth: 47, align: "center" });

    doc.rect(10, 175, 47.5, 20, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.beneficiario_directos, 129, pageHeight - 117, { maxWidth: 47, align: "center" });

    doc.rect(105, 175, 47.5, 20, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.beneficiario_indirectos, 176, pageHeight - 117, { maxWidth: 47, align: "center" });


    doc.rect(152.5, 175, 47.5, 20, 'S');




    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 195, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('MONTO DEL PROYECTO', pageWidth / 2, pageHeight - 95, { maxWidth: 100, align: "center" });
    doc.rect(10, 205, 100, 20, 'S');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(this.convertNumberService.convertNumberToWords(data.monto_inversionX), 11, pageHeight - 88, { maxWidth: 98, align: "justify" });

    doc.rect(110, 205, 90, 20, 'S');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(data.monto_inversion, 155, pageHeight - 82, { maxWidth: 190, align: "center" });



    doc.setFontSize(14);
    doc.setFillColor(128, 128, 128);
    doc.rect(10, 225, 190, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('DATOS DE LA INSTITUCIÓN ASESORA', pageWidth / 2, pageHeight - 65, { maxWidth: 190, align: "center" });
    doc.rect(10, 235, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('RIF DE LA INSTITUCIÓN', 25, pageHeight - 58, { maxWidth: 95, align: "center" });
    doc.rect(10, 245, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.Asesor_Rif, 50, pageHeight - 54, { maxWidth: 95, align: "center" });
    doc.rect(105, 235, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Nombre de la Institución, Persona Natural o Comité de Prevención Laboral', 152, pageHeight - 57, { maxWidth: 95, align: "center" });
    doc.rect(105, 245, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.Asesor_Nombre, 152, pageHeight - 48, { maxWidth: 95, align: "center" });




    doc.rect(10, 255, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('TELÉFONO CONTACTO', 25, pageHeight - 49, { maxWidth: 95, align: "center" });



    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(data.Asesor_Telefono, 50, pageHeight - 45, { maxWidth: 95, align: "center" });



    doc.rect(105, 255, 95, 10, 'S');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('CORREO ELECTRÓNICO', 25, pageHeight - 39, { maxWidth: 95, align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(data.Asesor_Correo, 50, pageHeight - 34, { maxWidth: 95, align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('NOMBRE DEL REPRESENTANTE', 125, pageHeight - 39, { maxWidth: 95, align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(data.Asesor_Representante, 152, pageHeight - 34, { maxWidth: 95, align: "center" });



    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    // doc.text('________________________________________', pageWidth / 2, pageHeight - 15, { maxWidth: 150, align: "center" });
    doc.text(`Asesorado por: `, pageWidth / 2, pageHeight - 10, { maxWidth: 145, align: "left" });



    doc.save(`${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf`);
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: `${data.ambito_descripcion.toUpperCase()} (${data.ambito_nombre}).pdf` });

  }

  CertificadoPagoMIF(data: any, Qr: any, TokenQr: any) {
    // console.log(data)
    let BancoPago
    if (data.nombre_bancos_MIF == 'Pago Complementario') {
      BancoPago = data.PG_Banco
    } else {
      BancoPago = data.nombre_banco_bancos_MIF
    }
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE PAGO MIF FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`REPÚBLICA BOLIVARIANA DE VENEZUELA`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    doc.text(`MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`SUPERINTENDENCIA NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 265, { maxWidth: 150, align: "center" });
    doc.text(`FONDO NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 260, { maxWidth: 150, align: "center" });


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${data.anio} -${data.Nomenclatura_mif}-${data.id_mif}-${TokenQr}`, pageWidth - 50, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO DE PAGO DE ${data.nombre_bancos_MIF.toUpperCase()} (Art.${data.articulo}) A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });

    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la recepción de la DECLARACIÓN del pago de ${data.nombre_bancos_MIF.toUpperCase()}  del contribuyente ${data.RazonSocial.toUpperCase()}  RIF ${data.Rif}, fecha de notificación ${data.notificacion} y pago realizado en fecha ${data.fechaPago}, correspondiente al período fiscal ${data.anio}, bajo el número de resolución ${data.Nomenclatura_mif}, por la cantidad de Bs. ${data.Monto_mif} , en el ${BancoPago} bajo el numero de referencia #${data.referencia}, ante el Fondo Nacional Antidrogas, correspondiente al período desde ${data.inicio_fiscal} hasta el ${data.cierre_fiscal}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de pago de multas a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de pago certifica la recepción del mismo en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    // doc.save("Ficha.pdf");
    doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Certificado de Pago MIF RECOSUP.pdf' });

  }

  NotificacionEmpresasNoInscritas(data: any, Qr: any, TokenQr: any) {
    // console.log(data)
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE PAGO MIF FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`REPÚBLICA BOLIVARIANA DE VENEZUELA`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    doc.text(`MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`SUPERINTENDENCIA NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 265, { maxWidth: 150, align: "center" });
    doc.text(`FONDO NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 260, { maxWidth: 150, align: "center" });


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${data.anio} -${data.Nomenclatura_mif}-${data.id_mif_no_inscri}-${TokenQr}`, pageWidth - 50, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`NOTIFICACIÓN DE PAGO POR ${data.nombre_bancos_MIF.toUpperCase()} (Art.${data.articulo}) A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });

    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`Se le informa al contribuyente ${data.NombreEmpresa.toUpperCase()}  RIF ${data.Rif}, que posee una notificación de pago de  ${data.nombre_bancos_MIF.toUpperCase()} ante el Fondo Nacional Antidrogas con fecha de  ${data.notificacion} correspondiente al período fiscal ${data.anio}, bajo el número de resolución ${data.Nomenclatura_mif}, por la cantidad de Bs. ${data.Monto_mif}, pagar ante el ${data.nombre_banco_bancos_MIF.toUpperCase()} (${data.cuenta_bancos_MIF})`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Evita sanciones.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    // doc.save("Ficha.pdf");
    doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Notificacion de Pago MIF RECOSUP.pdf' });

  }

  CertificadoPagoMIF_NoInscritas(data: any, Qr: any, TokenQr: any) {
    // console.log(data)
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE PAGO MIF FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`REPÚBLICA BOLIVARIANA DE VENEZUELA`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    doc.text(`MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`SUPERINTENDENCIA NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 265, { maxWidth: 150, align: "center" });
    doc.text(`FONDO NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 260, { maxWidth: 150, align: "center" });


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${data.anio} -${data.Nomenclatura_mif}-${data.id_mif_no_inscri}-${TokenQr}`, pageWidth - 50, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO DE PAGO DE POR ${data.nombre_bancos_MIF.toUpperCase()} DE APORTE (Art.${data.articulo}) EMPRESAS NO INSCRITAS A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });

    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la recepción de la DECLARACIÓN del pago de ${data.nombre_bancos_MIF.toUpperCase()}  del contribuyente ${data.NombreEmpresa.toUpperCase()}  RIF ${data.Rif}, fecha de notificación ${data.notificacion} y pago realizado en fecha ${data.fechaPago}, correspondiente al período fiscal ${data.anio}, bajo el número de resolución ${data.Nomenclatura_mif}, por la cantidad de Bs. ${data.Monto_mif} , en el ${data.nombre_banco_bancos_MIF} bajo el numero de referencia #${data.referencia}, ante el Fondo Nacional Antidrogas, correspondiente al período desde ${data.inicio_fiscal} hasta el ${data.cierre_fiscal}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("SANTIAGO LEON SANDOVAL BASTARDO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0117 G.O.Nº 42.979 de fecha 07/10/2024", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de pago de multas a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de pago certifica la recepción del mismo en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    // doc.save("Ficha.pdf");
    doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Certificado de Pago MIF RECOSUP.pdf' });

  }

}
