import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IActualizarDatosEmpresa, ICrearCertificados, IDataEmpresaCompleta, RECOSUP_U_FizcalizarEmpresa, RECOSUP_U_LegalFinanciero, RECOSUP_U_RepresentanteLegal, RECOSUP_U_Usuarios } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import { PdfService } from '@core/services/pdf/pdf.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contributing-companies',
  templateUrl: './contributing-companies.component.html',
  styleUrls: ['./contributing-companies.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class ContributingCompaniesComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IUpdateUsuario: RECOSUP_U_Usuarios = {
    Codigo: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    FechaModifico: '',
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: '',
    UsuarioId: 0
  }


  public IFizcalizacionBloqueo: RECOSUP_U_FizcalizarEmpresa = {
    status_bloqueo: 0,
    EmpresaId: 0
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
    Estado: undefined,
    CantidadEmpleados: '',
    Municipio: undefined,
    RazonSocial: '',
    sucursal: undefined,
    grupo_economico: undefined,
    campo_sujeto: undefined
  }

  public MiEmpresa = []

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public DataEmpresaCompleta: IDataEmpresaCompleta = {
    UsuarioId: 0,
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

  public U_RepresentanteLegal: RECOSUP_U_RepresentanteLegal = {
    TipoContactoId: 0,
    EmpresaId: 0,
    Cedula: '',
    Nombre: '',
    Apellido: '',
    Telefono: '',
    Celular: '',
    Fax: '',
    CorreoElectronico: '',
    Estatus: 0,
    UsuarioModifico: 0,
    FechaModifico: '',
    ContactoId: 0
  }


  public U_LegalFinanciero: RECOSUP_U_LegalFinanciero = {
    DocumentoFolio: undefined,
    DocumentoTomo: undefined,
    DocumentoProtocolo: undefined,
    DocumentoFecha: undefined,
    CodigoIvss: undefined,
    NotariaId: undefined,
    FechaCierreFiscal: undefined
  }

  public Status = [
    { id: '0', name: 'Inactivo' },
    { id: "1", name: 'Activo' }
  ]

  public TipoContacto = [
    { id: '1', name: 'Representante Legal' },
    { id: '2', name: 'Contacto' }
  ]

  public camposujeto = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' },
    { id: 2, name: 'NO APLICA' }
  ]

  public sucursales = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' },
    { id: 2, name: 'NO APLICA' }
  ]

  public ceseFuncion = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' },
  ]

  public empresaFusionada = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' },
  ]

  public grupoeconomico = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' },
    { id: 2, name: 'NO APLICA' }
  ]

  public ListaStatusEmpresa
  public titleModal
  public DataEmpresa
  public EmpresaUtilidadCierreFiscal
  public Utilidad
  public rowsUtilidadCierreFiscal
  public tempDataCierreFiscal
  public EmpresaDetalleMultas
  public rowsDetalleMultas
  public tempDataDetalleMultas
  public EmpresaDocumentosAdjuntos
  public rowsDocumentosAdjuntosEmpresa
  public tempDataDocumentosAdjuntosEmpresa


  public idEmpresaCert
  public idUsuarioCert

  public IdActividadEconomica
  public IdParroquiaEmpresa
  public IdUsuarioEmpresa

  public ShowFiscalizar = false

  showUpdateEmpresaRecaudacion = false

  public rowsRepresentantesContactos
  public dataRepresentantesContactos = [];
  public RepresentantesContactosLista = []
  public tempDataRepresentantesContactos = [];

  public dataEmpresasAportes = [];
  public sidebarToggleRef = false;
  public rowsEmpresasAportes;
  public rowsDetalleAporte;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public ListaEmpresasAportes = []

  public DataEmpresaAportes = []
  public EmpresaDetalleAportes = []

  public token
  public showUpdateEmpresa = false

  public searchValue = '';
  public searchValueRepresentanteLegal = ''

  public selectActividadEconomica
  public selectEstados
  public selectMunicipios
  public selectParroquias

  public IdEmpresa
  public ListaMultasNuevas = []
  public rowsDetalleMultasNuevas
  public tempDataDetalleMultasNuevas

  public SelectEmpresaId
  public SelectNotariaId

  public selectNotarias = []

  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  public isLoading: number = 0;

  // Private
  private tempDataEmpresasAportes = [];
  private tempDataUtilidadAportes = []
  private _unsubscribeAll: Subject<any>;


  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private pdf: PdfService,
    private _router: Router,

  ) {
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    if (this.token.Usuario[0].role == 9) {
      this.showUpdateEmpresa = true;
      this.showUpdateEmpresaRecaudacion = true
    }
    if (this.token.Usuario[0].role == 3) {
      this.ShowFiscalizar = true
    }
    if (this.token.Usuario[0].role == 1) {
      // this.showUpdateEmpresa = true;
      this.showUpdateEmpresaRecaudacion = true
    }
    await this.EmpresasAportes()
    await this.ListaNotarias()
    //  await this.ListaParroquias()
    await this.ListaEstados()
    await this.ListaActividadEconomica()

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

  async EmpresasAportes() {
    this.xAPI.funcion = "RECOSUP_R_Empresas_Aportes";
    this.xAPI.parametros = ''
    this.dataEmpresasAportes = [];
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            e.EmpresaFiscalizada = e.status_bloqueo
            //  if (e.status_bloqueo == 1) {
            this.ListaEmpresasAportes.push(e);
            //  }
          })
          // console.log(this.ListaEmpresasAportes)
          this.rowsEmpresasAportes = this.ListaEmpresasAportes
          this.tempDataEmpresasAportes = this.rowsEmpresasAportes;
          this.isLoading = 1;
        } else {
          this.isLoading = 2;
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaRepresentantesContactos(id: any) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_ListaRepresentantesContactos";
    this.xAPI.parametros = id
    this.RepresentantesContactosLista = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.Nombres = e.Nombre + ' ' + e.Apellido
          this.RepresentantesContactosLista.push(e);
        })
        this.rowsRepresentantesContactos = this.RepresentantesContactosLista
        this.tempDataRepresentantesContactos = this.rowsRepresentantesContactos;
        // console.log(this.RepresentantesContactosLista)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  FiscalizarEmpresaBloqueo(row: any) {
    // console.log(row)
    this.IFizcalizacionBloqueo.EmpresaId = row.EmpresaId
    this.IFizcalizacionBloqueo.status_bloqueo = 0
    Swal.fire({
      title: 'Esta seguro?',
      html: `Desea Fiscalizar la Empresa! <br> <font color='red'><strong>${row.RazonSocial}</strong></font> <br> Tenga en cuenta que la misma estará  <font color='red'><strong>INHABILITADA</strong></font> para los demas modulos del sistema`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Fiscalizarla!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'RECOSUP_U_FizcalizarEmpresa'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IFizcalizacionBloqueo)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo === 1) {
              this.modalService.dismissAll('Cerrar')
              this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
              // Actualizamos la tabla
              this._router.navigate(['inspection/contributing-companies']).then(() => { window.location.reload() });
            } else {
              this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  FiscalizarEmpresaDesbloqueo(row: any) {
    // console.log(row)
    this.IFizcalizacionBloqueo.EmpresaId = row.EmpresaId
    this.IFizcalizacionBloqueo.status_bloqueo = 1
    Swal.fire({
      title: 'Esta seguro?',
      html: `Desea Desactivar la Fizcalizacion de la Empresa! <br> <font color='red'><strong>${row.RazonSocial}</strong></font> <br> Tenga en cuenta que la misma estará  <font color='red'><strong>HABILITADA</strong></font> para los demas modulos del sistema`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Desbloquearla!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'RECOSUP_U_FizcalizarEmpresa'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IFizcalizacionBloqueo)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo === 1) {
              this.modalService.dismissAll('Cerrar')
              this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
              // Actualizamos la tabla
              this._router.navigate(['inspection/contributing-companies']).then(() => { window.location.reload() });
            } else {
              this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  async GuardarActualizacionDatosEmpresas() {
    this.UpdateEmpresa.grupo_economico = this.UpdateEmpresa.grupo_economico.id
    this.UpdateEmpresa.sucursal = this.UpdateEmpresa.sucursal.id
    this.UpdateEmpresa.campo_sujeto = this.UpdateEmpresa.campo_sujeto.id
    this.UpdateEmpresa.cese_funcion = this.UpdateEmpresa.cese_funcion.id
    this.UpdateEmpresa.empresa_fusionada = this.UpdateEmpresa.empresa_fusionada.id
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

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.length
        data.Cuerpo.map(e => {
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
          // console.log(e)
          this.DataEmpresaCompleta.sucursal = e.Xsucursal
          this.DataEmpresaCompleta.grupo_economico = e.Xgrupo_economico
          this.DataEmpresaCompleta.campo_sujeto = e.Xcampo_sujeto
          this.IdUsuarioEmpresa = e.EmpresaId
          this.UpdateEmpresa.UsuarioId = e.UsuarioId
          this.DataEmpresaCompleta.RazonSocial = e.RazonSocial
          this.DataEmpresaCompleta.Rif = e.Rif
          this.DataEmpresaCompleta.UsuarioId = e.UsuarioId
          this.DataEmpresaCompleta.Email = e.CorreoEmpresa
          this.DataEmpresaCompleta.SitioWeb = e.PaginaWeb
          this.DataEmpresaCompleta.Telefonos = e.TelefonoEmpresa + ' | ' + e.TelefonoLocal
          this.DataEmpresaCompleta.FaxEmpresa = e.FaxEmpresa
          this.DataEmpresaCompleta.ActividadEconomica = e.ActividadEconomica
          this.IdActividadEconomica = e.ActividadEconomicaId
          this.IdParroquiaEmpresa = e.ParroquiaId
          this.DataEmpresaCompleta.estado = e.Estado
          this.DataEmpresaCompleta.ciudad = e.Ciudad
          this.DataEmpresaCompleta.municipio = e.Municipio
          this.DataEmpresaCompleta.parroquia = e.Parroquia
          this.DataEmpresaCompleta.Direccion = e.Direccion
          this.DataEmpresaCompleta.FechaCierreFiscal = e.FechaCierreFiscal
          this.DataEmpresaCompleta.CantidadEmpleados = e.CantidadEmpleados
          this.DataEmpresaCompleta.FechaAprobacion = e.FechaAprobo
          this.DataEmpresaCompleta.FechaRegistro = e.FechaCreo
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
          this.SelectNotariaId = e.NotariaID
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

  async GenerarCertificadoInscripcion() {
    this.CrearCert.usuario = this.idUsuarioCert
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



  async GenerarCertificadoDeclaracionXXX(data: any) {
    // console.log(data)
    var EmpresaID = this.idEmpresaCert
    var Fecha = data.Fecha
    this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.CrearCert.usuario = this.idUsuarioCert
    this.CrearCert.type = 2 // 2 QR DECLARACION
    this.CrearCert.token = this.utilService.TokenAleatorio(10)
    this.xAPI.funcion = "RECOSUP_R_CertificadoDeclaracion"
    this.xAPI.parametros = EmpresaID + ',' + Fecha + ',' + data.EmpresaGananciaId
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (dataCertificados) => {
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

  async GenerarCertificadoAportes(dataRow: any) {
    this.CrearCert.usuario = this.idUsuarioCert
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


  async GenerarCertificadoDeclaracion(data: any) {
    // console.log(data)
    var Fecha = data.Fecha
    this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.CrearCert.usuario = this.idUsuarioCert
    this.CrearCert.type = 2 // 2 QR DECLARACION
    this.CrearCert.token = this.utilService.TokenAleatorio(10)
    this.xAPI.funcion = "RECOSUP_R_CertificadoDeclaracionContribuyente"
    this.xAPI.parametros = data.EmpresaId + ',' + data.Fecha + ',' + data.EmpresaGananciaId
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
                    // console.log(dataCertificados.Cuerpo[0], xdata.contenido, this.CrearCert.token)
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

  async UtilidadCierreFiscal(id: any) {
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal";
    this.xAPI.parametros = id
    this.EmpresaUtilidadCierreFiscal = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        this.Utilidad = data.Cuerpo.map(e => {
          e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
          e.Diferencia = this.utilService.diferenciaFecha(e.FechaHasta, e.FechaCreo)
          return e
          // this.Utilidad.push(e)
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

  async DetalleAportes(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Detalle_aportes";
    this.xAPI.parametros = id
    this.EmpresaDetalleAportes = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.EstatusGeneralId == 7 || e.EstatusGeneralId == 0 || e.EstatusGeneralId == 1 || e.EstatusGeneralId == 14) {
            e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
            // console.log(e)
            this.EmpresaDetalleAportes.push(e);
          }
        });
        // console.log(this.EmpresaDetalleAportes)
        this.rowsDetalleAporte = this.EmpresaDetalleAportes;
        this.tempDataUtilidadAportes = this.rowsDetalleAporte
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleMultas(id: any) {
    this.xAPI.funcion = "RECOSUP_R_detalle_multas_empresa";
    this.xAPI.parametros = id
    this.EmpresaDetalleMultas = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.EmpresaDetalleMultas.push(e);
        });
        this.rowsDetalleMultas = this.EmpresaDetalleMultas;
        this.tempDataDetalleMultas = this.rowsDetalleMultas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleMultasNuevas(data: any) {
    this.ListaMultasNuevas = []
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_ID";
    this.xAPI.parametros = data.EmpresaId
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // if (e.status_mif == '0' && this.Rif == e.Rif) {
          e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
          e.Monto_mif = this.utilService.ConvertirMoneda(e.Monto_mif)
          this.ListaMultasNuevas.push(e);
          // }
        });
        // console.log( this.ListaMultasNuevas)
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

  async ModalEditarEmpresaX() {
    const sel = [{
      apples: 'Apples',
      bananas: 'Bananas',
      grapes: 'Grapes',
      oranges: 'Oranges'
    }]
    this.xAPI.funcion = "RECOSUP_R_Listar_Estatus_Empresa";
    this.xAPI.parametros = ''
    this.ListaStatusEmpresa = [];
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaStatusEmpresa = [data.Cuerpo]
      },
      (error) => {
        console.log(error)
      }
    )
    const { value: fruit } = await Swal.fire({
      title: 'Seleccione Status',
      input: 'select',
      inputOptions: this.ListaStatusEmpresa.Estatus,
      inputPlaceholder: 'Seleccione Status',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === '') {
            resolve('Necesitas Seleccionar un Status')
          } else {
            Swal.fire(`Exitoso: ${value}`)
          }
        })
      }
    })
  }

  ModalEditarEmpresa(modal, row) {
    // console.log(row)
    this.UpdateEmpresa.RazonSocial = row.RazonSocial
    this.UpdateEmpresa.CorreoElectronico = row.CorreoEmpresa
    this.UpdateEmpresa.Telefono = row.TelefonoCelular
    this.UpdateEmpresa.Fax = row.TelefonoLocal
    this.UpdateEmpresa.ActividadEconomicaId = this.IdActividadEconomica
    this.UpdateEmpresa.Estado = row.estado
    this.UpdateEmpresa.Ciudad = row.ciudad
    this.UpdateEmpresa.Municipio = row.municipio
    this.UpdateEmpresa.ParroquiaId = this.IdParroquiaEmpresa
    this.UpdateEmpresa.Direccion = row.Direccion
    this.UpdateEmpresa.CorreoElectronico = row.Email
    this.UpdateEmpresa.CantidadEmpleados = row.CantidadEmpleados
    this.UpdateEmpresa.sucursal = row.sucursal
    this.UpdateEmpresa.grupo_economico = row.grupo_economico
    this.UpdateEmpresa.campo_sujeto = row.campo_sujeto
    this.UpdateEmpresa.cese_funcion = row.cese_funcion
    this.UpdateEmpresa.empresa_fusionada = row.empresa_fusionada
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalEditarRepresentanteLegal(modal, data) {
    this.modalService.dismissAll('Cerrar')
    // console.log(data);
    this.ListaRepresentantesContactos(this.IdUsuarioEmpresa)
    this.titleModal = data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalEditarDatosLegales(modal, data) {
    this.modalService.dismissAll('Cerrar')
    this.U_LegalFinanciero.EmpresaId = this.SelectEmpresaId
    // this.U_LegalFinanciero.NotariaId = 1
    this.U_LegalFinanciero.DocumentoFolio = data.DocumentoFolio
    this.U_LegalFinanciero.DocumentoTomo = data.DocumentoTomo
    this.U_LegalFinanciero.DocumentoProtocolo = data.DocumentoProtocolo
    this.U_LegalFinanciero.CodigoIvss = data.CodigoIvss
    this.U_LegalFinanciero.NotariaId = this.SelectNotariaId
    this.U_LegalFinanciero.DocumentoFecha = data.DocumentoFecha
    this.U_LegalFinanciero.FechaCierreFiscal = data.FechaCierreFiscal
    // console.log(this.U_LegalFinanciero);
    // this.ListaRepresentantesContactos(this.IdUsuarioEmpresa)
    this.titleModal = data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  CapturarNotaria(event) {
    this.U_LegalFinanciero.NotariaId = event
  }

  async ActualizarDatosLegalesFinancieros() {
    // RECOSUP_U_LegalFinanciera
    console.log(this.U_LegalFinanciero)
    this.xAPI.funcion = 'RECOSUP_U_LegalFinanciera'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.U_LegalFinanciero)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Cerrar')
          this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
          // Actualizamos la tabla
          this._router.navigate(['financial-collection/contributing-companies']).then(() => { window.location.reload() });
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaNotarias() {
    this.xAPI.funcion = "RECOSUP_R_NotariasTodas";
    this.xAPI.parametros = ''
    this.selectNotarias = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.selectNotarias = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.NotariaId
          return e
        });
        // console.log(this.selectNotarias)
      },
      (error) => {
        console.log(error)
      }
    )

  }


  ModalEditarUsuario(modal, data) {
    this.modalService.dismissAll('Cerrar')
    this.titleModal = data.RazonSocial
    this.xAPI.funcion = "RECOSUP_R_UsuarioID";
    this.xAPI.parametros = data.UsuarioId
    this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.IUpdateUsuario.UsuarioId = this.DataEmpresaCompleta.UsuarioId
          this.IUpdateUsuario.Codigo = e.Codigo
          this.IUpdateUsuario.Nombres = e.Nombres
          this.IUpdateUsuario.Apellidos = e.Apellidos
          this.IUpdateUsuario.Cedula = e.Cedula
          this.IUpdateUsuario.FechaModifico = this.utilService.FechaActual()
          this.IUpdateUsuario.TelefonoLocal = e.TelefonoLocal
          this.IUpdateUsuario.TelefonoCelular = e.TelefonoCelular
          this.IUpdateUsuario.CorreoPrincipal = e.CorreoPrincipal
          this.IUpdateUsuario.CorreoSecundario = e.CorreoSecundario
          this.IUpdateUsuario.Cargo = e.Cargo
        });
      },
      err => {

      })
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  EditarRepresentanteLegalModal(modal, data) {
    this.modalService.dismissAll('Cerrar')
    // console.log(data);
    this.U_RepresentanteLegal.ContactoId = data.ContactoId
    this.U_RepresentanteLegal.EmpresaId = data.EmpresaId
    this.U_RepresentanteLegal.Cedula = data.Cedula
    this.U_RepresentanteLegal.Nombre = data.Nombre
    this.U_RepresentanteLegal.Apellido = data.Apellido
    this.U_RepresentanteLegal.Celular = data.Celular
    this.U_RepresentanteLegal.Telefono = data.Telefono
    this.U_RepresentanteLegal.Fax = data.Fax
    this.U_RepresentanteLegal.TipoContactoId = data.TipoContactoId
    this.U_RepresentanteLegal.Estatus = data.Estatus
    this.U_RepresentanteLegal.CorreoElectronico = data.CorreoElectronico
    this.U_RepresentanteLegal.FechaModifico = this.utilService.FechaActual()
    this.titleModal = data.Nombres
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async UpdateRepresentanteLegal() {
    this.xAPI.funcion = 'RECOSUP_U_RepresentanteLegal'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.U_RepresentanteLegal)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Cerrar')
          this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
          // Actualizamos la tabla
          this._router.navigate(['financial-collection/contributing-companies']).then(() => { window.location.reload() });
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async UpdateUsuarios() {
    this.xAPI.funcion = 'RECOSUP_U_Usuarios'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IUpdateUsuario)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Cerrar')
          this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
          // Actualizamos la tabla
          this._router.navigate(['financial-collection/contributing-companies']).then(() => { window.location.reload() });
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  filterUpdateUtilidadAportes(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataCierreFiscal.filter(function (d) {
      return d.FechaAporte.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUtilidadCierreFiscal = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
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

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  async DetalleEmpresa(modal, data) {
    this.SelectEmpresaId = data.EmpresaId
    await this.DetalleMultasNuevas(data)
    this.idEmpresaCert = data.EmpresaId
    this.idUsuarioCert = data.UsuarioId
    await this.EmpresaRIF(data.Rif)
    await this.UtilidadCierreFiscal(data.EmpresaId)
    await this.DetalleAportes(data.EmpresaId)
    await this.DetalleMultas(data.EmpresaId)
    await this.DocumentosAdjuntosEmpresa(data.UsuarioId, data.EmpresaId)
    this.titleModal = data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  async GenerarConstancia(datay: any) {
    // console.log(datay)
    // this.pdf.CertificadoPagoMIF(data)
    this.CrearCert.usuario = datay.UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 4, // 1 INSCRIPCIÓN
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
                  this.pdf.CertificadoPagoMIF(datay, xdata.contenido, this.CrearCert.token)
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

  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataEmpresasAportes.filter(function (d) {
      return d.RazonSocial.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresasAportes = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateRepresentanteLegal(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataRepresentantesContactos.filter(function (d) {
      return d.Nombres.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsRepresentantesContactos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}

