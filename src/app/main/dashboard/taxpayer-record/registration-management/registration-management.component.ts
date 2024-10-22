import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, DocumentoAdjunto, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { PdfService } from '@core/services/pdf/pdf.service';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import Stepper from 'bs-stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreConfigService } from '@core/services/config.service';
import { UtilService } from '@core/services/util/util.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IActualizarDatosEmpresa, ICrearCertificados, IDataEmpresaCompleta, IEmpresa, IEmpresaContactos } from '@core/services/empresa/empresa.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-registration-management',
  templateUrl: './registration-management.component.html',
  styleUrls: ['./registration-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class RegistrationManagementComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public fechaActual = new Date();

  public Empresa: IEmpresa = {
    UsuarioId: 0,
    RazonSocial: '',
    Direccion: '',
    Rif: '',
    Telefono: '',
    Fax: '',
    CorreoElectronico: '',
    PaginaWeb: '',
    Ciudad: '',
    ParroquiaId: undefined,
    ActividadEconomicaId: undefined,
    DocumentoFecha: undefined,
    DocumentoFolio: '',
    DocumentoTomo: '',
    DocumentoProtocolo: '',
    CodigoIvss: '',
    FechaInicioFiscal: '',
    FechaCierreFiscal: '',
    NotariaId: undefined,
    CantidadEmpleados: undefined,
    EstatusEmpresa: '1',
    UsuarioAprobo: 0,
    FechaAprobo: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
    UsuarioCreo: 0,
    FechaCreo: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
    UsuarioModifico: 0,
    FechaModifico: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
    sucursal: undefined,
    grupo_economico: undefined,
    campo_sujeto: undefined
  }

  public ContactoEmpresa: IEmpresaContactos = {
    TipoContactoId: undefined,
    EmpresaId: undefined,
    CedulaContacto: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Celular: '',
    Fax: '',
    CorreoElectronico: '',
    Estatus: '1',
    UsuarioCreo: undefined,
    FechaCreo: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss"),
    UsuarioModifico: undefined,
    FechaModifico: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd HH:mm:ss")
  }


  public UpdateEmpresa: IActualizarDatosEmpresa = {
    UsuarioId: 0,
    Direccion: '',
    Telefono: '',
    Fax: '',
    ParroquiaId: undefined,
    ActividadEconomicaId: undefined,
    CorreoElectronico: '',
    Ciudad: '',
    Estado: '',
    CantidadEmpleados: '',
    Municipio: '',
    RazonSocial: ''
  }

  public DataEmpresaCompleta: IDataEmpresaCompleta = {
    RazonSocial: '',
    Rif: '',
    Email: '',
    SitioWeb: '',
    Telefonos: '',
    FaxEmpresa: '',
    ActividadEconomica: '',
    estado: '',
    ciudad: '',
    municipio: '',
    parroquia: '',
    Direccion: '',
    FechaCierreFiscal: '',
    CantidadEmpleados: '',
    FechaRegistro: '',
    FechaAprobacion: '',
    RegistroMercantil: '',
    DocumentoFecha: '',
    DocumentoFolio: '',
    DocumentoProtocolo: '',
    DocumentoTomo: '',
    CodigoIvss: '',
    CedulaContacto: '',
    nombre: '',
    apellido: '',
    telefonoContacto: '',
    celularContacto: '',
    CorreoElectronico: '',
    TipoContacto: '',
    Usuario: '',
    Cedula: '',
    Nombres: '',
    Apellidos: '',
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: ''
  }



  public loginForm: FormGroup;

  public Register: any
  //   // Formulario 1
  public tipoRif: any;

  public MinMaxDPdata: NgbDateStruct;

  public selectRIF = [
    { name: 'J' },
    { name: 'G' }
  ];

  public selectTipoDocumento = [
    { name: 'V' },
    { name: 'E' }
  ];

  public selectTipoContacto = [
    { id: 1, name: 'Representante Legal' },
    { id: 2, name: 'Contacto' }
  ];


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public token: any
  public hashcontrol = ''
  public numControl: string = ''

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

  public datetime1: NgbDateStruct;
  public datetime2: NgbDateStruct;


  public DataEmpresa = []
  public EmpresaUtilidadCierreFiscal = []
  public EmpresaDetalleAportes = []
  public EmpresaDetalleMultas = []
  public EmpresaDocumentosAdjuntos = []


  public basicDPdata: NgbDateStruct;
  public fromDate: NgbDate | null;
  public toDate: NgbDate | null;


  public selectMulti = [{ name: 'English' }, { name: 'French' }, { name: 'Spanish' }];
  public selectMultiSelected;

  // private
  private horizontalWizardStepper: Stepper;
  private verticalWizardStepper: Stepper;
  private modernWizardStepper: Stepper;
  private modernVerticalWizardStepper: Stepper;
  private bsStepper;



  // Modal Detalle de Aporte
  public DA_Banco: string;
  public DA_CanalPago: string;
  public DA_Articulo: string;
  public DA_Nombre: string;
  public DA_ejercicioFiscal: string;
  public DA_FechaAporte: string;
  public DA_ReferenciaBancaria: string;
  public DA_Monto: string;
  public DA_Tipo: string;
  public DA_FechaCompletaAporte: string;
  // Modal Detalle de Aporte


  public Utilidad = [];
  public EmpresasAportes = [];
  public apiData;

  // Subir Archivos
  public archivos = []
  //  Subir archivos

  // QR
  public Qr


  // IDEMPRESA
  public IdEmpresa
  public EmpresaActiva

  //  Lista de Tipo de Documentacion
  public TipoDocument: string = '0'
  public lstTipoDoc = []


  // Editar Campos de la Empresa
  public MiEmpresa = []

  public Rif

  public ListaMultasNuevas = []
  public rowsDetalleMultasNuevas
  public tempDataDetalleMultasNuevas = []

  // Public
  public sidebarToggleRef = false;
  public rowsUtilidadCierreFiscal;
  public rowsDetalleAporte;
  public rowsDetalleMultas;
  public rowsDocumentosAdjuntosEmpresa;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public uri
  public url

  public selectBasic = [
    { id: 1, name: 'SI' },
    { id: 0, name: 'NO' },
    { id: 2, name: 'NO APLICA' }
  ]

  public searchValue = '';

  public selectActividadEconomica
  public selectEstados
  public selectMunicipios
  public selectParroquias
  public selectNotarias

  public SelectBancosMIF

  public role:any = ""

  public tipoDocumento
  public RIFEMPRESA
  public CEDULAREPRESENTANTE

  // Registrar Empresa
  public Parroquia
  //  Registrar Empresa Contactos
  public EmpresaContacto


  // Decorator
  @ViewChild('fileUpload1')
  private fileUpload1: AngularFileUploaderComponent
  @ViewChild(DatatableComponent) table: DatatableComponent;


  /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
  horizontalWizardStepperNext(data) {
    if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }

  /**
   * Vertical Wizard Stepper Next
   */
  verticalWizardNext() {
    this.verticalWizardStepper.next();
  }
  /**
   * Vertical Wizard Stepper Previous
   */
  verticalWizardPrevious() {
    this.verticalWizardStepper.previous();
  }
  /**
   * Modern Horizontal Wizard Stepper Next
   */
  modernHorizontalNext() {
    this.modernWizardStepper.next();
  }
  /**
   * Modern Horizontal Wizard Stepper Previous
   */
  modernHorizontalPrevious() {
    this.modernWizardStepper.previous();
  }
  /**
   * Modern Vertical Wizard Stepper Next
   */
  modernVerticalNext() {
    this.modernVerticalWizardStepper.next();
  }
  /**
   * Modern Vertical Wizard Stepper Previous
   */
  modernVerticalPrevious() {
    this.modernVerticalWizardStepper.previous();
  }


  // Private
  private tempDataCierreFiscal = [];
  private tempDataUtilidadAportes = []
  private tempDataDetalleMultas = []
  private tempDataDocumentosAdjuntosEmpresa = []
  private _unsubscribeAll: Subject<any>;


  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private modalService: NgbModal,
    private pdf: PdfService,
    private router: Router,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute
  ) {

  }

  async ngOnInit() {
    this.uri = this.rutaActiva.snapshot.url
    this.url = this.uri[0] + this.uri[1]
    this.sectionBlockUI.start('Subiendo Documento, Porfavor Espere!!!');
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token.Usuario[0])
    this.role = this.token.Usuario[0].EsAdministrador
    this.RIFEMPRESA = this.token.Usuario[0].Codigo.slice(1, -1)
    this.CEDULAREPRESENTANTE = this.token.Usuario[0].Cedula
    this.Empresa.Rif = this.token.Usuario[0].Codigo.slice(1)
    this.tipoRif = this.token.Usuario[0].Codigo.charAt(0)
    this.ContactoEmpresa.CedulaContacto = this.token.Usuario[0].CedulaR.slice(1)
    this.tipoDocumento = this.token.Usuario[0].CedulaR.charAt(0)
    // console.log(this.Empresa.Rif)
    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    this.Rif = this.token.Usuario[0].Rif
    // await this.ListaParroquias()
    await this.ListaEstados()
    await this.ListaActividadEconomica()
    if (this.IdEmpresa != null) {
      await this.EmpresaRIF(this.token.Usuario[0].Rif)
      // console.log(this.DataEmpresa)
      await this.DetalleMultasNuevas()
      // await this.ListaBancosMIF() 
      await this.ListTipoDoc()
      await this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
      await this.DetalleAportes(this.token.Usuario[0].EmpresaId)
      await this.DetalleMultas(this.token.Usuario[0].EmpresaId)
      await this.DocumentosAdjuntosEmpresa(this.token.Usuario[0].UsuarioId, this.token.Usuario[0].EmpresaId)
    } else {
      this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});
      this.bsStepper = document.querySelectorAll('.bs-stepper');
    }
  }

  onInputChange(event: any) {
    this.Empresa.RazonSocial = event.target.value.toUpperCase();
  }

  Descargar(row:any){
    this.pdf.DatosEmpresa()
  }


  fileSelected(e) {
    this.archivos.push(e.target.files[0])
  }

  async subirArchivo(e) {
    var frm = new FormData(document.forms.namedItem("forma"))
    // this.sectionBlockUI.start('Subiendo Documento, Porfavor Espere!!!');
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.DocAdjunto.nombre = this.archivos[0].name
    this.DocAdjunto.usuario = this.token.Usuario[0].UsuarioId
    this.DocAdjunto.empresa = this.token.Usuario[0].EmpresaId
    this.DocAdjunto.numc = this.numControl
    this.DocAdjunto.tipo = parseInt(this.TipoDocument)
    this.DocAdjunto.vencimiento = '2022-08-28'
    // console.log(this.DocAdjunto)
    try {
      await this.apiService.EnviarArchivos(frm).subscribe(
        (data) => {
          console.log(data)
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

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
    // this.router.navigate([this.url]) .then(() => {window.location.reload()});
  }


  async GenerarCertificadoDeclaracion(data: any) {
    // console.log(data)
    var EmpresaID = this.DataEmpresa[0].EmpresaId
    var Fechax = data.Fecha
    this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.CrearCert.usuario = this.token.Usuario[0].UsuarioId
    this.CrearCert.type = 2, // 2 QR DECLARACION
      this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.xAPI.funcion = "RECOSUP_R_CertificadoDeclaracion";
    this.xAPI.parametros = EmpresaID + ',' + Fechax + ',' + data.EmpresaGananciaId
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (dataCertificados) => {
        // console.log(dataCertificados)
        // var id = 'RIfEmpresa'
        var id = this.CrearCert.token
        let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
        this.apiService.GenQR(id, ruta).subscribe(
          (data) => {
            this.apiService.LoadQR(id).subscribe(
              (xdata) => {
                this.xAPI.funcion = "RECOSUP_C_Certificados";
                this.xAPI.parametros = ''
                this.xAPI.valores = JSON.stringify(this.CrearCert)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                  (data) => {
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

  async GenerarCertificadoInscripcion() {
    this.CrearCert.usuario = this.token.Usuario[0].UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 1, // 1 INSCRIPCIÓN
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  this.pdf.CertificadoInscripcion(sdata, xdata.contenido, this.CrearCert.token)
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarCertificadoAportes(dataRow: any) {
    this.CrearCert.usuario = this.token.Usuario[0].UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 3, // 3 QR APORTES
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  this.pdf.GenerarCertificadoAportes(sdata, xdata.contenido, this.CrearCert.token, dataRow)
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.length
        data.Cuerpo.map(e => {
          // console.log(e)
          switch (e.sucursal) {
            case '0':
              e.Xsucursal = 'NO'
              break;
            case '1':
              e.Xsucursal = 'SI'
              break;
            case '2':
              e.Xsucursal = 'NO APLICA'
              break;
            default:
              break;
          }
          switch (e.grupo_economico) {
            case '0':
              e.Xgrupo_economico = 'NO'
              break;
            case '1':
              e.Xgrupo_economico = 'SI'
              break;
            case '2':
              e.Xgrupo_economico = 'NO APLICA'
              break;
            default:
              break;
          }
          switch (e.campo_sujeto) {
            case '0':
              e.Xcampo_sujeto = 'NO'
              break;
            case '1':
              e.Xcampo_sujeto = 'SI'
              break;
            case '2':
              e.Xcampo_sujeto = 'NO APLICA'
              break;
            default:
              break;
          }
          switch (e.cese_funcion) {
            case '0':
              e.Xcese_funcion = 'NO'
              break;
            case '1':
              e.Xcese_funcion = 'SI'
              break;
            default:
              break;
          }
          switch (e.empresa_fusionada) {
            case '0':
              e.Xempresa_fusionada = 'NO'
              break;
            case '1':
              e.Xempresa_fusionada = 'SI'
              break;
            default:
              break;
          }
          this.DataEmpresaCompleta.RazonSocial = e.RazonSocial
          this.DataEmpresaCompleta.Rif = e.Rif
          this.DataEmpresaCompleta.sucursal = e.Xsucursal
          this.DataEmpresaCompleta.grupo_economico = e.Xgrupo_economico
          this.DataEmpresaCompleta.campo_sujeto = e.Xcampo_sujeto
          this.DataEmpresaCompleta.Email = e.CorreoEmpresa
          this.DataEmpresaCompleta.SitioWeb = e.PaginaWeb
          this.DataEmpresaCompleta.Telefonos = e.TelefonoEmpresa + ' | ' + e.TelefonoLocal
          this.DataEmpresaCompleta.FaxEmpresa = e.FaxEmpresa
          this.DataEmpresaCompleta.ActividadEconomica = e.ActividadEconomica
          this.DataEmpresaCompleta.estado = e.Estado
          this.DataEmpresaCompleta.ciudad = e.Ciudad
          this.DataEmpresaCompleta.municipio = e.Municipio
          this.DataEmpresaCompleta.parroquia = e.Parroquia
          this.DataEmpresaCompleta.Direccion = e.Direccion
          this.DataEmpresaCompleta.FechaCierreFiscal = this.utilService.FechaMomentL(e.FechaCierreFiscal)
          this.DataEmpresaCompleta.CantidadEmpleados = e.CantidadEmpleados
          this.DataEmpresaCompleta.FechaAprobacion = this.utilService.FechaMomentL(e.FechaAprobo)
          this.DataEmpresaCompleta.FechaRegistro = this.utilService.FechaMomentL(e.FechaCreo)
          this.DataEmpresaCompleta.RegistroMercantil = e.Notaria
          this.DataEmpresaCompleta.DocumentoFecha = e.DocumentoFecha
          this.DataEmpresaCompleta.DocumentoFolio = e.DocumentoFolio
          this.DataEmpresaCompleta.DocumentoProtocolo = e.DocumentoProtocolo
          this.DataEmpresaCompleta.DocumentoTomo = e.DocumentoTomo
          this.DataEmpresaCompleta.CodigoIvss = e.CodigoIvss
          this.DataEmpresaCompleta.CedulaContacto = e.CedulaContacto
          this.DataEmpresaCompleta.nombre = e.Nombre
          this.DataEmpresaCompleta.apellido = e.Apellido
          this.DataEmpresaCompleta.telefonoContacto = e.Telefono
          this.DataEmpresaCompleta.celularContacto = e.Celular
          this.DataEmpresaCompleta.CorreoElectronico = e.CorreoElectronico
          this.DataEmpresaCompleta.TipoContacto = e.TipoContacto
          this.DataEmpresaCompleta.Usuario = e.Codigo
          this.DataEmpresaCompleta.Cedula = e.Cedula
          this.DataEmpresaCompleta.Nombres = e.Nombres
          this.DataEmpresaCompleta.Apellidos = e.Apellidos
          this.DataEmpresaCompleta.TelefonoLocal = e.TelefonoLocal
          this.DataEmpresaCompleta.TelefonoCelular = e.TelefonoCelular
          this.DataEmpresaCompleta.CorreoPrincipal = e.CorreoPrincipal
          this.DataEmpresaCompleta.CorreoSecundario = e.CorreoSecundario
          this.DataEmpresaCompleta.Cargo = e.Cargo
          this.DataEmpresaCompleta.cese_funcion = e.Xcese_funcion
          this.DataEmpresaCompleta.empresa_fusionada = e.Xempresa_fusionada
          this.DataEmpresa.push(e);
        });
        // console.log(this.DataEmpresa)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListTipoDoc() {
    this.xAPI.funcion = "RECOSUP_R_Listar_Tipo_Documentos_Empresas";
    this.xAPI.parametros = ''
    this.EmpresaDocumentosAdjuntos = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.lstTipoDoc.push(e);
        });
        // console.log(this.lstTipoDoc)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  filterUpdateUtilidadCierreFiscal(event) {
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

  filterUpdateUtilidadAportes(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataUtilidadAportes.filter(function (d) {
      return d.FechaAporte.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleAporte = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateDetalleMultas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultas.filter(function (d) {
      return d.Anio.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleMultas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateDocumentoAdjuntoEmpresa(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDocumentosAdjuntosEmpresa.filter(function (d) {
      return d.fech.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDocumentosAdjuntosEmpresa = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  async UtilidadCierreFiscal(id: any) {
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal_Contribuyente";
    this.xAPI.parametros = id
    this.EmpresaUtilidadCierreFiscal = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.ejercicioFiscal = this.utilService.FechaMomentL(e.FechaDesde) + ' | ' + this.utilService.FechaMomentL(e.FechaHasta)
          e.Monto = this.utilService.ConvertirMoneda(e.Monto)
          e.Diferencia = this.utilService.diferenciaFecha(e.FechaHasta, e.FechaCreo)
          this.Utilidad.push(e)
          // return e
        });
        // setTimeout(() => {
        this.rowsUtilidadCierreFiscal = this.Utilidad;
        this.tempDataCierreFiscal = this.rowsUtilidadCierreFiscal;
        // }, 450);
        // console.log(this.Utilidad)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleAportes(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Detalle_aportes_Contribuyente";
    this.xAPI.parametros = id
    this.EmpresaDetalleAportes = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
          e.Monto = this.utilService.ConvertirMoneda(e.Monto)
          //  return e
          this.EmpresaDetalleAportes.push(e);
        });
        // setTimeout(() => {
        this.rowsDetalleAporte = this.EmpresaDetalleAportes;
        this.tempDataUtilidadAportes = this.rowsDetalleAporte
        // }, 450);
        // console.log(this.EmpresaDetalleAportes)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ModalDetails(modal, data) {
    this.apiData = data
    // console.info(this.apiData)
    this.DA_Banco = data.Banco
    this.DA_CanalPago = data.CanalPago
    this.DA_Articulo = data.Articulo
    this.DA_Nombre = data.Nombre
    this.DA_ejercicioFiscal = data.ejercicioFiscal
    this.DA_FechaAporte = data.FechaAporte
    this.DA_ReferenciaBancaria = data.ReferenciaBancaria
    this.DA_Monto = data.Monto
    this.DA_Tipo = data.Tipo
    this.DA_FechaCompletaAporte = data.FechaCompletaAporte
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalEditarEmpresa(modal) {
    let Rif = this.token.Usuario[0].Rif
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = Rif
    this.DataEmpresa = []
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.ListaParroquias(e.MunicipioId)
          this.ListaMunicipios(e.EstadoId)
          this.UpdateEmpresa.RazonSocial = e.RazonSocial
          this.UpdateEmpresa.CorreoElectronico = e.CorreoEmpresa
          this.UpdateEmpresa.Telefono = e.TelefonoEmpresa
          this.UpdateEmpresa.Fax = e.FaxEmpresa
          this.UpdateEmpresa.ActividadEconomicaId = e.ActividadEconomicaId
          this.UpdateEmpresa.Estado = e.Estado
          this.UpdateEmpresa.Ciudad = e.Ciudad
          this.UpdateEmpresa.Municipio = e.Municipio
          this.UpdateEmpresa.ParroquiaId = e.ParroquiaId
          this.UpdateEmpresa.Direccion = e.Direccion
          this.UpdateEmpresa.CantidadEmpleados = e.CantidadEmpleados
          this.MiEmpresa.push(e)
        });
        // console.log(this.MiEmpresa)
      },
      (error) => {
        console.log(error)
      }
    )

  }


  ModalSubirArchivo(modal) {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.numControl = this.token.Usuario[0].Rif
    this.hashcontrol = btoa("D" + this.numControl) //Cifrar documentos
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async DetalleMultas(id: any) {
    this.xAPI.funcion = "RECOSUP_R_detalle_multas_empresa_Contribuyente";
    this.xAPI.parametros = id
    this.EmpresaDetalleMultas = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.FechaDocumento = this.utilService.FechaMomentL(e.FechaDocumento)
          e.Monto = this.utilService.ConvertirMoneda(e.Monto)
          this.EmpresaDetalleMultas.push(e);
        });
        this.rowsDetalleMultas = this.EmpresaDetalleMultas;
        this.tempDataDetalleMultas = this.rowsDetalleMultas
        // console.log(this.EmpresaDetalleMultas)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleMultasNuevas() {
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_ID";
    this.xAPI.parametros = this.IdEmpresa
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // if (e.status_mif == '0' && this.Rif == e.Rif) {
          e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
          e.Monto_mif = this.utilService.ConvertirMoneda(e.Monto_mif)
          this.ListaMultasNuevas.push(e);
          // }
        });
        this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
        this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DocumentosAdjuntosEmpresa(usuario: any, empresa: any) {
    var idd = empresa
    var usua = usuario
    this.xAPI.funcion = "RECOSUP_R_DocumentosAdjuntos_Empresas";
    this.xAPI.parametros = idd + ',' + usua;
    this.EmpresaDocumentosAdjuntos = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.EmpresaDocumentosAdjuntos.push(e);
        });
        // setTimeout(() => {
        this.rowsDocumentosAdjuntosEmpresa = this.EmpresaDocumentosAdjuntos;
        this.tempDataDocumentosAdjuntosEmpresa = this.rowsDocumentosAdjuntosEmpresa
        //  }, 450);
        // console.log(this.EmpresaDocumentosAdjuntos)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaActividadEconomica() {
    this.xAPI.funcion = "RECOSUP_R_ActividadEconomica";
    this.selectActividadEconomica = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectActividadEconomica = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.Codigo
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaEstados() {
    this.xAPI.funcion = "RECOSUP_R_Estados";
    this.selectEstados = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectEstados = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.EstadoId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaBancosMIF(d: any) {
    this.xAPI.funcion = "RECOSUP_R_ListarBancosMIF";
    this.SelectBancosMIF = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.SelectBancosMIF = data.Cuerpo.map(e => {
          if (e.id_bancos_MIF === d.TipoMultaId) {
            e.id = e.id_bancos_MIF
            e.name = e.nombre_bancos_MIF + ' ( ' + e.nombre_banco_bancos_MIF + '  -  ' + e.cuenta_bancos_MIF + ' ) '
            // console.log(e)
            // this.SelectBancosMIF.push(e)
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaMunicipios(id: string) {
    this.xAPI.funcion = "RECOSUP_R_Municipios";
    this.xAPI.parametros = id;
    this.selectMunicipios = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectMunicipios = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.MunicipioId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async PagarMultasNuevas(modal: any, data: any) {
    // await this.ListaBancosMIF(data)
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ListaParroquias(id: string) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_Parroquias_ID";
    this.xAPI.parametros = id;
    this.selectParroquias = []
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.selectParroquias = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.ParroquiaId
          return e
        });
        // console.log(this.selectParroquias)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaNotarias(id: any) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_Notarias";
    this.xAPI.parametros = id
    this.selectNotarias = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.selectNotarias = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.ParroquiaId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )

  }


  async GuardarActualizacionDatosEmpresas() {
    this.UpdateEmpresa.UsuarioId = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = 'RECOSUP_U_MiEmpresa'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.UpdateEmpresa)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Cerrar')
          this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
          // Actualizamos la tabla
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async CreateEmpresa() {
    // Datos Registrar Empresa
    this.Empresa.UsuarioId = this.token.Usuario[0].UsuarioId,
      this.Empresa.Rif = this.tipoRif + this.Empresa.Rif,
      //  this.Empresa.FechaAprobo = '0001-01-01',
      this.Empresa.DocumentoFecha = this.Empresa.DocumentoFecha.year + '-' + this.Empresa.DocumentoFecha.month + '-' + this.Empresa.DocumentoFecha.day
    this.Empresa.UsuarioCreo = this.token.Usuario[0].UsuarioId,
      this.Empresa.UsuarioModifico = this.token.Usuario[0].UsuarioId,
      this.Empresa.FechaInicioFiscal = this.Empresa.FechaInicioFiscal.year + '-' + this.Empresa.FechaInicioFiscal.month + '-' + this.Empresa.FechaInicioFiscal.day
    this.Empresa.FechaCierreFiscal = this.Empresa.FechaCierreFiscal.year + '-' + this.Empresa.FechaCierreFiscal.month + '-' + this.Empresa.FechaCierreFiscal.day
    // Datos Registrar Contactos de Empresa
    this.xAPI.funcion = 'RECOSUP_C_Empresas'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.Empresa)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        // console.log(this.Empresa)
        if (data.tipo === 1) {
          let empresaIDAdd = data.msj
          this.ContactoEmpresa.EmpresaId = empresaIDAdd
          this.ContactoEmpresa.UsuarioCreo = this.token.Usuario[0].UsuarioId
          this.ContactoEmpresa.UsuarioModifico = this.token.Usuario[0].UsuarioId
          this.xAPI.funcion = 'RECOSUP_C_Empresa_Contactos'
          this.xAPI.parametros = ''
          this.xAPI.valores = JSON.stringify(this.ContactoEmpresa)
          this.apiService.Ejecutar(this.xAPI).subscribe(
            (dataE) => {
              console.log(dataE)
              this.utilService.alertConfirmMini('success', 'Empresa Registrada Exitosamente!')
              sessionStorage.clear();
              localStorage.clear();
              this.router.navigate(['/login']);
            },
            (error) => {
              this.utilService.alertConfirmMini('info', 'Oops! Lo sentimos algo salio mal, intente de nuevo')
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Lo sentimos algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        this.utilService.alertConfirmMini('error', error)
        // console.error(error)
      }
    )
  }



}
