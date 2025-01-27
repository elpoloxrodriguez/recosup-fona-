import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { IToken, LoginService } from '@core/services/seguridad/login.service';
import Swal from 'sweetalert2';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';
import { DatePipe } from '@angular/common';
import { IUsuariosSistema } from '@core/services/empresa/empresa.service';

@Component({
  selector: 'app-auth-register-users',
  templateUrl: './auth-register-users.component.html',
  styleUrls: ['./auth-register-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthRegisterUsersComponent implements OnInit {

  public fechaActual = new Date();

  public UsersRegister: IUsuariosSistema = {
    Codigo: '',
    Clave: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    FechaNacimiento: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd"),
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: 'Empresa',
    EsAdministrador: 0,
    Estatus: 0,
    SuspencionId: 'NULL',
    SuspencionDescripcion: 'NULL',
    UsuarioCreo: 1,
    FechaCreo: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd"),
    UsuarioModifico: 1,
    FechaModifico: this.datePipe.transform(this.fechaActual, "yyyy-MM-dd")
  }


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  //  SELECT 
  public SelectCedula = [
    { name: 'J' },
    { name: 'G' }
  ]

  public SelectDocumentoCedula = [
    { name: 'V' },
    { name: 'E' }

  ]



  //  input register taxpaye
  // public fechaActual = new Date();
  public register
  public tipoDocumento
  public tipoDocumentoCedula
  public confirmeContrasenaUsuario

  public username

  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public confirmeContrasenaUsuarioTextType: boolean;
  public contrasenaUsuarioTextType: boolean;
  public usuario: string;
  public clave: string;


  public iToken: IToken = { token: '', };
  public itk: IToken;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private apiService: ApiService,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private loginService: LoginService,
    private _router: Router
  ) {

    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }
  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.confirmeContrasenaUsuarioTextType = !this.confirmeContrasenaUsuarioTextType;
    this.contrasenaUsuarioTextType = !this.contrasenaUsuarioTextType;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    if (sessionStorage.getItem("token") != undefined) {
      this._router.navigate(['/home'])
      return
    }
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }


  async registerTaxpayer() {
    this.UsersRegister.Clave = this.utilService.md5(this.UsersRegister.Clave)
    this.UsersRegister.Codigo = this.tipoDocumento.name + this.UsersRegister.Codigo
    this.UsersRegister.Cedula = this.tipoDocumentoCedula.name+this.UsersRegister.Cedula
    this.xAPI.funcion = 'RECOSUP_C_ChequearRIFEmpresa'
    this.xAPI.parametros = this.UsersRegister.Codigo
    this.xAPI.valores = ''
    await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length != 1) {
          this.xAPI.funcion = 'RECOSUP_C_Usuarios_Sistema'
          this.xAPI.parametros = ''
          this.xAPI.valores = JSON.stringify(this.UsersRegister)
          this.apiService.EjecutarDev(this.xAPI).subscribe(
            (data) => {
              if (data.tipo === 1) {
                this.utilService.alertConfirmMini('success', 'Felicidades! Registro Exitoso')
                this._router.navigate(['/'])
              } else {
                this.SelectCedula = undefined
                this.tipoDocumento = undefined
                this.UsersRegister.Cedula = undefined
                this.UsersRegister.Codigo = ''
                this.utilService.alertConfirmMini('warning', 'Oops! Lo sentimos el RIF ya se encuentra registrado, intente de nuevo y/o contacte a Recaudación FONA.')
              }
            },
            (error) => {
              console.error(error)
            }
          )
        } else {
          this.SelectCedula = undefined
          this.tipoDocumento = undefined
          this.UsersRegister.Cedula = undefined
          this.UsersRegister.Codigo = ''
          this.utilService.alertConfirmMini('warning', 'Oops! Lo sentimos el RIF ya se encuentra registrado, intente de nuevo y/o contacte a Recaudación FONA.')
        }
      },
      (err) => {
        console.log(err)
      }
    )

    // this.xAPI.funcion = 'RECOSUP_C_Usuarios_Sistema'
    // this.xAPI.parametros = ''
    // this.xAPI.valores = JSON.stringify(this.UsersRegister)
    // await this.apiService.EjecutarDev(this.xAPI).subscribe(
    //   (data) => {
    //    if (data.tipo === 1) {
    //     this.utilService.alertConfirmMini('success', 'Felicidades! Registro Exitoso')
    //     this._router.navigate(['/'])
    //    } else {
    //     this.utilService.alertConfirmMini('error', 'Oops! Lo sentimos algo salio mal, intente de nuevo.')
    //    }
    //   },
    //   (error) => {
    //     console.error(error)
    //   }
    // )

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
