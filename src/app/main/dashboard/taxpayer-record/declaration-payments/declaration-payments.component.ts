import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, DocumentoAdjunto, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { ICrearCertificados, IDeclararUtilidad, RECOSUP_U_EmpresasAportes } from '@core/services/empresa/empresa.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Spanish from 'flatpickr/dist/l10n/es.js';
import { AngularFileUploaderComponent } from 'angular-file-uploader';

import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import {
  I18n,
  CustomDatepickerI18n
} from '@core/services/util/datapicker.service';

@Component({
  selector: 'app-declaration-payments',
  templateUrl: './declaration-payments.component.html',
  styleUrls: ['./declaration-payments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class DeclarationPaymentsComponent implements OnInit {

  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent


  public Dutilidad: IDeclararUtilidad = {
    EmpresaId: 0,
    EmpresaGananciaId: '0',
    Fecha: undefined,
    FechaDesde: undefined,
    FechaHasta: undefined,
    Monto: '',
    DeclaraPerdida: undefined,
    DeclaraTrabajadores: undefined,
    Articulo: undefined,
    EstatusGeneralId: '0',
    UsuarioCreo: 0,
    FechaCreo: '',
    UsuarioModifico: 0,
    FechaModifico: '',
    ejercicioFiscal: '',
    Diferencia: 0,
    TipoAporte: undefined,
  }

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public hashcontrol = ''
  public numControl: string = ''
  // Subir Archivos
  public archivos = []


  public DocAdjunto: DocumentoAdjunto = {
    usuario: '',
    nombre: '',
    empresa: '',
    numc: '',
    tipo: 0,
    vencimiento: ''
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public FechaSelect: {
    id: undefined,
    name: undefined
  }

  public IUpdateEmpresasAportes: RECOSUP_U_EmpresasAportes = {
    EmpresaId: undefined,
    EmpresaGananciaId: undefined,
    TipoAporteCuentaId: undefined,
    CanalPago: '',
    FechaAporte: '',
    FechaDesde: '',
    FechaHasta: '',
    FechaDocumento: '',
    ReferenciaBancaria: '',
    TipoPagoId: undefined,
    Articulo: undefined,
    Monto: '',
    FechaBancoPago: '',
    Observacion: '',
    EstatusGeneralId: undefined,
    UsuarioModifico: undefined,
    EmpresaAporteId: undefined
  }

  public añoActual = new Date()
  public DatepickerYear = this.añoActual.getFullYear()
  public DatepickerMonth = this.añoActual.getMonth()

  public SaberArticuloSeleccionado

  public ActividadEconomicaEmpresa
  public TipoArticuloModal
  public TipoArticulo
  public CantidadEmpleadosMasoMenos
  public CapturarEventoTrabajadores
  public showButtonPayment = false
  public rowsUtilidadCierreFiscal = []
  public DataGananaciasContribuyente
  public Utilidad = [];
  public xDetalleAporte = []
  public SelectArticulo = []
  public SelectBancos = []
  public SelectTipoPago = []
  public SelectAnioAporte = []
  public SelectPerdida = [
    {
      id: 'Si',
      name: 'SI TUVE PERDIDA',
    },
    {
      id: 'No',
      name: 'NO TUVE PERDIDA',
    }
  ]
  public SelectTrabajadores = [
    {
      id: '50 o mas',
      name: '50 O MAS TRABAJADORES',
    },
    {
      id: 'Menos de 50',
      name: 'MENOS DE 50 TRABAJADORES',
    }
  ]
  public SelectTipoPagox = [
    {
      id: '0',
      name: 'Estimado',
    },
    {
      id: '1',
      name: 'Definitivo',
    }
  ]

  public ShowValidadMonto = false
  public ValorEvaluarPerdida
  public rowsDetalleAporte;
  public token

  // Fecha Actual
  public fechaActual = new Date();
  public EmpresaGananciaId = 0
  // registrar ganancias
  public inicioFiscal: any
  public cierreFiscal: any

  public ArticuloContribuyenteAporte

  //  Registrar pago aporte
  public AddPagoAporte: any
  public pEmpresaId
  public pTipoAporteCuentaId
  public pFechaAporte
  public pFechaDesde
  public pFechaHasta
  public pFechaDocumento
  public pReferenciaBancaria
  public pTipoPagoId
  public pMonto
  public pObservacion
  public articulo
  public banco
  public pUsuarioCreo
  public pFechaCreo
  public pUsuarioModifico
  public pFechaModifico
  public FechaBancoPago
  public EstatusGeneralId
  public MontoTotalGanancia
  public Porcentaje
  public TotalMontoAPagar
  public MontoConvert
  public IdEmpresa
  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public searchValue = '';

  public ButtonShow = false;

  public MontoDeclarado

  public NuevaListFecha = []

  public ArticuloAnio = []

  public lstPagos = []

  public idEmpresaCert
  public idUsuarioCert

  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public rows;
  public tempFilterData;
  public previousStatusFilter = '';

  private tempDataCierreFiscal = [];

  private tempDataDetalleAporte = []
  public rowsDataDetalleAporte = []

  public showInput: boolean = false

  public showReadonly: boolean = false

  constructor(
    private utilService: UtilService,
    private _router: Router,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private modalService: NgbModal,
    private pdf: PdfService,
  ) {
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    // this.cargarAnios()
    this.token = jwt_decode(sessionStorage.getItem('token'))
    this.ActividadEconomicaEmpresa = this.token.Usuario[0].ActividadEconomicaId
    // console.log(this.ActividadEconomicaEmpresa)
    this.IdEmpresa = this.token.Usuario[0].EmpresaId

    if (this.token.Usuario[0].ActividadEconomicaId == '11' || this.token.Usuario[0].ActividadEconomicaId == '60') {
      this.FuncSelectAnioAporte(this.token.Usuario[0].EmpresaId)
    } else {
      this.FuncSelectAnioAporte(this.token.Usuario[0].EmpresaId)
    }

    if (this.IdEmpresa != null) {
      this.ButtonShow = true
      await this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
      await this.SelecArticulo()
      await this.SelecTiposPagos()
    } else {
      this.ButtonShow = false
    }
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  LimpiarDeclaracionGanancia() {
    this.Dutilidad = {
      EmpresaId: 0,
      EmpresaGananciaId: '',
      Fecha: undefined,
      FechaDesde: undefined,
      FechaHasta: undefined,
      Monto: '',
      DeclaraPerdida: '',
      DeclaraTrabajadores: '',
      Articulo: '',
      EstatusGeneralId: '0',
      UsuarioCreo: 0,
      FechaCreo: '',
      UsuarioModifico: 0,
      FechaModifico: '',
      ejercicioFiscal: '',
      Diferencia: 0,
      TipoAporte: undefined,
    }
  }

  async EvaluarPerdida(data: any) {
    this.ValorEvaluarPerdida = data
    await this.MasOMenosEmpleados()
  }

  async Empleados(data: any) {
    this.CantidadEmpleadosMasoMenos = data
    await this.MasOMenosEmpleados()
  }

  MasOMenosEmpleados() {
    //  console.log(this.ValorEvaluarPerdida)
    //  console.log(this.CantidadEmpleadosMasoMenos)
    //  console.log(this.TipoArticulo)
    //  this.ShowValidadMonto = true
    //  this.Dutilidad.Monto = '0.00'

    if (this.ActividadEconomicaEmpresa === '60' || this.ActividadEconomicaEmpresa === '11') {
      // SI la empresa es vendedora de licor o tabaco
      if (this.ValorEvaluarPerdida === 'Si' && this.CantidadEmpleadosMasoMenos === '50 o mas') {
        this.ShowValidadMonto = true
        this.Dutilidad.Monto = '0.00'
        if (this.TipoArticulo === '32' && this.TipoArticulo === '34') {
          this.ShowValidadMonto = true
          this.Dutilidad.Monto = '0.00'
        }
      }
      if (this.ValorEvaluarPerdida === 'Si' && this.CantidadEmpleadosMasoMenos === 'Menos de 50') {
        this.ShowValidadMonto = true
        this.Dutilidad.Monto = '0.00'
        if (this.TipoArticulo === '32' && this.TipoArticulo === '34') {
          this.ShowValidadMonto = true
          this.Dutilidad.Monto = '0.00'
        }
      }
      if (this.ValorEvaluarPerdida === 'No' && this.CantidadEmpleadosMasoMenos === '50 o mas') {
        if (this.TipoArticulo === '32' && this.TipoArticulo === '34') {
          this.ShowValidadMonto = false
          this.Dutilidad.Monto = ''
        }
      }
      if (this.ValorEvaluarPerdida === 'No' && this.CantidadEmpleadosMasoMenos === 'Menos de 50') {
        if (this.TipoArticulo === '32') {
          this.ShowValidadMonto = true
          this.Dutilidad.Monto = '0.00'
        }
        if (this.TipoArticulo === '34') {
          this.ShowValidadMonto = false
          this.Dutilidad.Monto = ''
        }
      }

    } else {
      // NO la empresa es vendedora de licor o tabaco
      if (this.ValorEvaluarPerdida === 'No' && this.CantidadEmpleadosMasoMenos === '50 o mas') { // EVALUO SI TUVO PERDIDAS O NO
        this.ShowValidadMonto = false
        this.Dutilidad.Monto = ''
      } else {
        this.ShowValidadMonto = true
        this.Dutilidad.Monto = '0.00'
      }

    }
  }


  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async subirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    // this.sectionBlockUI.start('Subiendo Documento, Porfavor Espere!!!');
    this.DocAdjunto.nombre = this.archivos[0].name
    this.AddPagoAporte.Bauche = this.DocAdjunto.nombre
    this.DocAdjunto.usuario = this.token.Usuario[0].UsuarioId
    this.DocAdjunto.empresa = this.token.Usuario[0].EmpresaId
    this.DocAdjunto.numc = this.numControl
    this.DocAdjunto.tipo = 1
    this.DocAdjunto.vencimiento = '2022-08-28'
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          // console.log(data)
          this.xAPI.funcion = 'RECOSUP_I_DocumentosAdjuntos_Empresas'
          this.xAPI.parametros = ''
          this.xAPI.valores = JSON.stringify(this.DocAdjunto)
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (xdata) => {
              if (xdata.tipo == 1) {
                this.utilService.alertConfirmMini('success', 'Tu archivo ha sido cargado con exito')
                this.modalService.dismissAll('Cerrar Modal')
                //  this.sectionBlockUI.stop();
              } else {
                this.utilService.alertConfirmMini('info', xdata.msj)
              }
            },
            (error) => {
              this.utilService.alertConfirmMini('error', error)
            }
          )
        }
      )
    } catch (error) {
      this.utilService.alertConfirmMini('error', error)
    }

  }


  async UtilidadCierreFiscal(id: any) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal_Registro_Empresa";
    this.xAPI.parametros = id + ',' + 0
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.CantidadPagos != null) {
            e.CantidadPagos = 1
          } else {
            e.CantidadPagos = 0
          }
          e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
          e.Montox = e.Monto
          e.Monto = this.utilService.ConvertirMoneda(e.Monto)
          e.Diferencia = 0
          e.tipo = e.TipoAporte
          this.Utilidad.push(e)
        });
        // console.log(this.Utilidad)
        this.rowsUtilidadCierreFiscal = this.Utilidad;
        this.tempDataCierreFiscal = this.rowsUtilidadCierreFiscal;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  cargarAnios() {
    this.SelectAnioAporte = []
    var anioActual = new Date()
    var anio = anioActual.getFullYear()
    for (let index = 2010; index <= anio - 1; index++) {
      this.SelectAnioAporte.push(index)
    }
  }

  async BuscarElemento() {
    await this.cargarAnios()
    this.lstPagos.map(e => {
      if (this.Dutilidad.Articulo == e.Articulo) {
        let pos = 0
        for (let i = 0; i < this.SelectAnioAporte.length; i++) {
          const element = this.SelectAnioAporte[i];
          if (element == e.Fecha) {
            pos = i
          }
        }
        this.SelectAnioAporte.splice(pos, 1)
      }
    })
  }

  FuncSelectAnioAporte(id: any) {
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal_Contribuyente_SelectDeclaracionAnio";
    this.xAPI.parametros = id
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstPagos = data.Cuerpo
      },
      (error) => {
        console.log(error);
      }
    )
  }


  FuncSelectAnioDobleAportante(id: any) {
    var anioActual = new Date()
    var anio = anioActual.getFullYear()
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal_Contribuyente_SelectDeclaracionAnio";
    this.xAPI.parametros = id
    this.xAPI.valores = ''
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.lstPagos = data.Cuerpo
      },
      (error) => {
        console.log(error);
      }
    )
  }


  ConvertirCadena(cadena: string): string {
    return cadena.toLowerCase().replace(/á/g, "a").replace(/ê/g, "i").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
  }

  getPosition(id: string, nature: any): number {
    let pos = -1
    let i = 0
    nature.forEach(e => {
      if (e == id) {
        pos = i
        return
      }
      i++
    })
    return pos
  }


  async DetalleAportes(id: any) {
    this.MontoDeclarado = id.Monto
    this.xAPI.funcion = "RECOSUP_R_ListarDetalleDeclararPagos";
    this.xAPI.parametros = id.EmpresaGananciaId
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.Montox = e.Monto
          e.FechaBancoPago = this.utilService.FechaMomentL(e.FechaBancoPago)
          e.Monto = this.utilService.ConvertirMoneda(e.Monto)
          this.xDetalleAporte.push(e)
        });
        // console.log(this.xDetalleAporte)
        this.rowsDataDetalleAporte = this.xDetalleAporte;
        this.tempDataDetalleAporte = this.rowsDataDetalleAporte;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async CambiarMonto(id: any) {
    this.TipoArticulo = id
    await this.MasOMenosEmpleados()
    // if (this.CapturarEventoTrabajadores === 'Menos de 50') {
    //   if (id === '32' ) {
    //     this.Dutilidad.Monto = '0.00'
    //     this.ShowValidadMonto = true        
    //   } else {
    //     this.Dutilidad.Monto = ''
    //     this.ShowValidadMonto = false        
    //   }
    // }
    this.xAPI.funcion = "RECOSUP_R_Lista_Tipos_Aportes_Variable";
    this.xAPI.parametros = id
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Porcentaje = data.Cuerpo[0].Porcentaje
        this.TotalMontoAPagar = this.MontoTotalGanancia * (this.Porcentaje / 100)
        this.MontoConvert = this.utilService.ConvertirMoneda(this.TotalMontoAPagar)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async SelecArticulo() {
    this.xAPI.funcion = "RECOSUP_R_Lista_Tipos_Aportes";
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (this.ActividadEconomicaEmpresa === '60' || this.ActividadEconomicaEmpresa === '11') {
            if (e.Codigo <= 34) {
              e.name = e.Nombre
              e.id = e.Codigo
              this.SelectArticulo.push(e)
            }
          } else {
            if (e.Codigo <= 32) {
              e.name = e.Nombre
              e.id = e.Codigo
              this.SelectArticulo.push(e)
            }
          }
        });
        // console.log(this.SelectArticulo)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async SelecTiposPagos() {
    this.SelectTipoPago.push(
      {
        FechaCreo: "2010-05-05 15:05:01",
        FechaModifico: "2010-05-05 15:05:01",
        Nombre: "Reportar Pago en Cero (0,00)",
        TipoPagoId: "3",
        UsuarioCreo: "1",
        UsuarioModifico: "1",
        id: "3",
        name: "Reportar Pago en Cero (0,00)"
      }
    )
    this.xAPI.funcion = "RECOSUP_R_Tipos_Pagos";
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.TipoPagoId <= 2) {
            e.name = e.Nombre
            e.id = e.TipoPagoId
            this.SelectTipoPago.push(e)
          }
        });
        // console.log(this.SelectTipoPago)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  CapturarItemSelecTiposPagos(info: any) {
    // console.log(info)
    if (info.TipoPagoId == '3') {
      this.showInput = true
      this.showReadonly = true
    } else {
      this.showInput = false
      this.showReadonly = false
    }
    if (info.name == 'Reportar Pago en Cero (0,00)') {
      let ref = this.utilService.TokenAleatorio(10)
      this.pReferenciaBancaria = ref
      this.FechaBancoPago = ''
      this.pMonto = '0.00'
    } else {
      this.pReferenciaBancaria = ''
      this.FechaBancoPago = ''
      // this.pMonto = ''
    }
  }


  async SelecBanco(id: any) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_Tipo_Aporte_Cuenta";
    this.xAPI.parametros = id
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.SelectBancos = data.Cuerpo.map(e => {
          e.name = 'Banco' + ' ' + e.Nombre + ' ' + e.Numero
          e.id = e.TipoAporteCuentaId
          return e
          // this.SelectBancos.push(e)
        });
        // console.log(this.SelectBancos)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async onSubmit() {
    this.Dutilidad.EmpresaId = this.token.Usuario[0].EmpresaId
    this.Dutilidad.FechaDesde = this.Dutilidad.FechaDesde.year + '-' + this.Dutilidad.FechaDesde.month + '-' + this.Dutilidad.FechaDesde.day,
      this.Dutilidad.FechaHasta = this.Dutilidad.FechaHasta.year + '-' + this.Dutilidad.FechaHasta.month + '-' + this.Dutilidad.FechaHasta.day,
      this.Dutilidad.UsuarioCreo = this.token.Usuario[0].UsuarioId,
      this.Dutilidad.FechaCreo = this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss")
    this.Dutilidad.UsuarioModifico = this.token.Usuario[0].UsuarioId,
      this.Dutilidad.FechaModifico = this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss")
    this.Dutilidad.ejercicioFiscal = this.Dutilidad.FechaDesde + ' | ' + this.Dutilidad.FechaHasta
    this.Dutilidad.Monto = this.Dutilidad.Monto
    this.Dutilidad.Articulo = this.Dutilidad.Articulo
    this.Dutilidad.TipoAporte = this.Dutilidad.TipoAporte.name
    this.Dutilidad.Fecha = this.Dutilidad.Fecha.toString()
    this.xAPI.funcion = "RECOSUP_C_Registrar_Ganacias_Contribuyente";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.Dutilidad)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success', 'Ganancias Registradas Exitosamente')
          this.Utilidad = []
          this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
          this.LimpiarDeclaracionGanancia()
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async GenerarCertificadoDeclaracion(data: any) {
    // console.log(data)
    this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.CrearCert.usuario = data.EmpresaId
    this.CrearCert.type = 2, // 2 QR DECLARACION
      this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.xAPI.funcion = "RECOSUP_R_CertificadoDeclaracionContribuyente";
    this.xAPI.parametros = data.EmpresaId + ',' + data.Fecha + ',' + data.EmpresaGananciaId + ',' + '0'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (dataCertificados) => {
        // console.log(dataCertificados)
        // var id = 'RIfEmpresa'
        var id = this.CrearCert.token
        let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
        this.apiService.GenQR(id, ruta).subscribe(
          (data) => {
            // console.log(data)
            this.apiService.LoadQR(id).subscribe(
              (xdata) => {
                this.xAPI.funcion = "RECOSUP_C_Certificados";
                this.xAPI.parametros = ''
                this.xAPI.valores = JSON.stringify(this.CrearCert)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                  (data) => {
                    // console.log(data)
                    this.pdf.CertificadoDeclaracion(dataCertificados.Cuerpo[0], xdata.contenido, this.CrearCert.token)
                    this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                  },
                  (err) => {
                    this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
                  }
                )
              },
              (error) => {
                console.log(error)
              }
            )
          }
        )
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async DeleteGananciaContribuyente(data: any) {
    // console.log(data)
    let EmpresaGananciaId = data.EmpresaGananciaId
    let EmpresaId = data.EmpresaId
    await Swal.fire({
      title: 'Esta Seguro?',
      text: "De Eliminar Este Registro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = "RECOSUP_D_Registrar_Ganacias_Contribuyente";
        this.xAPI.parametros = EmpresaGananciaId + ',' + EmpresaId
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsUtilidadCierreFiscal.push(this.Dutilidad)
            // console.log(data)
            if (data.tipo === 1) {
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
              this.Utilidad = []
              this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
            } else {
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }


  async PagarAporteContribuyente() {
    let data = this.DataGananaciasContribuyente
    var e = ''
    this.subirArchivo(e)
    this.AddPagoAporte = {
      Bauche: this.DocAdjunto.nombre,
      EmpresaId: this.token.Usuario[0].EmpresaId,
      TipoAporteCuentaId: this.pTipoAporteCuentaId,
      CanalPago: this.pTipoPagoId.name.substr(0, 3),
      FechaAporte: data.Fecha,
      FechaDesde: data.FechaDesde,
      FechaHasta: data.FechaHasta,
      FechaDocumento: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd"),
      ReferenciaBancaria: this.pReferenciaBancaria,
      TipoPagoId: this.pTipoPagoId.id,
      Articulo: this.articulo,
      Monto: this.pMonto,
      EmpresaGananciaId: this.EmpresaGananciaId,
      FechaBancoPago: this.FechaBancoPago.year + '-' + this.FechaBancoPago.month + '-' + this.FechaBancoPago.day,
      EstatusGeneralId: 17,
      UsuarioCreo: this.token.Usuario[0].UsuarioId,
      FechaCreo: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
      UsuarioModifico: this.token.Usuario[0].UsuarioId,
      FechaModifico: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
    }
    // console.log(this.AddPagoAporte)
    this.xAPI.funcion = "RECOSUP_C_Reportar_Pago_Aportes_Contribuyentes";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.AddPagoAporte)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.Utilidad = []
          this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
          this.utilService.alertConfirmMini('success', 'Pago Registrado Exitosamente')
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! algo salio mal, intente nuevamente')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  /**
 * filterUpdate
 *
 * @param event
 */
  filterUpdateUtilidadAportes(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataCierreFiscal.filter(function (d) {
      return d.Fecha.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUtilidadCierreFiscal = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterDetalleAportes(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleAporte.filter(function (d) {
      return d.ReferenciaBancaria.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDataDetalleAporte = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  AddRegister(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  RegistrarPagarAporte(modal, data) {
    // console.log(data)
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.numControl = this.token.Usuario[0].Rif
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos

    this.SaberArticuloSeleccionado = data.Articulo
    // console.log(data)
    if (data.Articulo == '32') {
      var monto1 = data.Montox * 1 / 100
      this.pMonto = monto1.toFixed(2)
    } else {
      var monto1 = data.Montox * 2 / 100
      this.pMonto = monto1.toFixed(2)
    }
    this.SelecBanco(data.Articulo)
    this.CambiarMonto(data.Articulo)
    this.articulo = data.Articulo
    this.TipoArticuloModal = data.Articulo
    this.EmpresaGananciaId = data.EmpresaGananciaId
    this.DataGananaciasContribuyente = data
    this.MontoTotalGanancia = data.Montox
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModaldetailsCambioPago(modal, data) {
    // console.log(data)
    if (data.TipoPagoId == '3') {
      this.showInput = true
      this.showReadonly = true
    } else {
      this.showInput = false
      this.showReadonly = false
    }
    this.MontoConvert = data.Monto
    this.modalService.dismissAll('Close')
    this.SelecBanco(data.Articulo)
    this.IUpdateEmpresasAportes.EmpresaId = data.EmpresaId
    this.IUpdateEmpresasAportes.EmpresaGananciaId = data.EmpresaGananciaId
    this.IUpdateEmpresasAportes.TipoAporteCuentaId = data.TipoAporteCuentaId
    this.IUpdateEmpresasAportes.CanalPago = data.CanalPago
    this.IUpdateEmpresasAportes.FechaAporte = data.FechaAporte
    this.IUpdateEmpresasAportes.FechaDesde = data.FechaDesde
    this.IUpdateEmpresasAportes.FechaHasta = data.FechaHasta
    this.IUpdateEmpresasAportes.FechaDocumento = data.FechaDocumento
    this.IUpdateEmpresasAportes.ReferenciaBancaria = data.ReferenciaBancaria
    this.IUpdateEmpresasAportes.TipoPagoId = data.TipoPagoId
    this.IUpdateEmpresasAportes.Articulo = data.Articulo
    this.IUpdateEmpresasAportes.Monto = data.Montox
    this.IUpdateEmpresasAportes.FechaBancoPago = data.FechaBancoPago
    this.IUpdateEmpresasAportes.Observacion = data.Observacion
    this.IUpdateEmpresasAportes.EstatusGeneralId = 17
    this.IUpdateEmpresasAportes.UsuarioModifico = this.IdEmpresa
    this.IUpdateEmpresasAportes.EmpresaAporteId = data.EmpresaAporteId
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async CambiarDatosAportesEmpresas() {

    this.xAPI.funcion = "RECOSUP_U_EmpresasAportes";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IUpdateEmpresasAportes)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success', 'Datos de Aporte Modificados Exitosamente')
          this.Utilidad = []
          this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  DetallesPagosAporte(modal, data) {
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }





}

