import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { IDeclararUtilidad, IRECOSUP_C_Proyectos, IRECOSUP_U_ActualizarMatriz, RECOSUP_U_ProyectosUpdate } from '@core/services/empresa/empresa.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Spanish from 'flatpickr/dist/l10n/es.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {
  I18n,
  CustomDatepickerI18n
} from '@core/services/util/datapicker.service';
import { CoreConfigService } from '@core/services/config.service';
import { ConvertNumberService } from '@core/services/util/convert-number.service';
import { Console } from 'console';


@Component({
  selector: 'app-movement-evaluation',
  templateUrl: './movement-evaluation.component.html',
  styleUrls: ['./movement-evaluation.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class MovementEvaluationComponent implements OnInit {

  public UpdateMatriz : IRECOSUP_U_ActualizarMatriz = {
    anio: 0,
    tipoEvaluado: undefined,
    cantidad: 0,
    personas: 0,
    mesEvaluado: undefined,
    estado: undefined
  };

  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  

  public rows = []
  public searchValue = '';

  public ButtonShow = false;

  public movement = []

  public tempData = []

  public token
  public IdEmpresa
  public IdUser
  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private utilService : UtilService,
    private apiService : ApiService,
    private modalService: NgbModal,
  ) { }

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'))
    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    this.IdUser = this.token.Usuario[0].UsuarioId

    await this.ListMovement()
  }

      /**
   * filterUpdate
   *
   * @param event
   */
      filterUpdate(event) {
        // Reset ng-select on search
        const val = event.target.value.toLowerCase();
        // Filter Our Data
        const temp = this.tempData.filter(function (d) {
          return d.mes.toLowerCase().indexOf(val) !== -1 || !val;
        });
        // Update The Rows
        this.rows = temp;
        // Whenever The Filter Changes, Always Go Back To The First Page
        this.table.offset = 0;
      }

      async ListMovement() {
        this.xAPI.funcion = "RECOSUP_R_ListaMovimientoEvaluacion";
        this.xAPI.parametros = '2023'
        this.xAPI.valores = ""
         await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.movement.push(e)
            });
            this.rows = this.movement;
            this.tempData = this.rows;
  
          },
          (error) => {
            console.log(error)
          }
        )
      }

     async ReversarMovimientos(data){
        let valor = data.valor * -1
        this.UpdateMatriz.cantidad = valor
        this.UpdateMatriz.anio = data.anio
        this.UpdateMatriz.estado = data.estado
        this.UpdateMatriz.mesEvaluado = data.mes
        this.UpdateMatriz.tipoEvaluado = data.codigo
        this.xAPI.funcion = "RECOSUP_I_MatrizMovimientos";
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.UpdateMatriz)
        this.movement = []
        await Swal.fire({
          title: 'Esta Seguro?',
          text: "De Reversar Este Movimiento!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Reversarlo!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
         this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo === 1) {
              this.ListMovement()
              this.utilService.alertConfirmMini('success','Movimiento Reversado Exitosamente') 
            } else {
              this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
      }

}