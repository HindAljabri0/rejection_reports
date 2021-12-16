import { DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AddFinalRejectionModel } from 'src/app/models/addFinalRejectionModel';
import { AddPaymentReconciliationModel } from 'src/app/models/addPaymentReconciliationModel';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { ReconciliationService } from 'src/app/services/reconciliationService/reconciliation.service';
import { SharedServices } from 'src/app/services/shared.services';
@Component({
  selector: 'app-reconciliation-add-payment',
  templateUrl: './reconciliation-add-payment.component.html',
  styleUrls: ['./reconciliation-add-payment.component.css']
})
export class ReconciliationAddPaymentComponent implements OnInit {
  addPaymentReconciliationModel = new AddPaymentReconciliationModel();
  addPaymentForm: FormGroup;
  datePickerConfig: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD/MM/YYYY' };
  startDateController: FormControl = new FormControl();
  endDateController: FormControl = new FormControl();
  payementData: any[] = [];
  payerIdControl: FormControl = new FormControl();
  minDate: any;
  selctedReconciliationPayerData: any = [];
  status: boolean = false;

  constructor(
    private dialog: MatDialogRef<ReconciliationAddPaymentComponent>,
    private reconciliationService: ReconciliationService,
    private sharedService: SharedServices,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.status = false;
    this.addPaymentReconciliationModel.reconciliationId = this.data.id
    this.addPaymentReconciliationModel.payerId = this.data.payerId
    this.formLoad();

  }

  closeDialog() {
    this.dialog.close();
  }


  formLoad() {
    const threeMonthPreviousDate = new Date().setMonth(new Date().getMonth() - 3);
    this.addPaymentForm = this.formBuilder.group({
      fromDate: [new Date(threeMonthPreviousDate), Validators.required],
      toDate: [new Date(), Validators.required],
    });
  }
  search() {
    if (this.addPaymentForm.invalid)
      return
    
  
     const fromDate = moment(this.addPaymentForm.value.fromDate).format('YYYY-MM-DD');
     const toDate = moment(this.addPaymentForm.value.toDate).format('YYYY-MM-DD');
    
    this.sharedService.loadingChanged.next(true);
    this.reconciliationService.getReconciliationReceivalble(
      this.sharedService.providerId,
      this.data.payerId,
      fromDate,
      toDate
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          let body: any = event['body'];
          this.payementData = JSON.parse(body);
          this.sharedService.loadingChanged.next(false);
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        console.log(err);
      }
    });
  }







  addPaymentReceivableData() {

    this.sharedService.loadingChanged.next(true);
    const body = {
     reconciliationId: this.data.id}
       this.selctedReconciliationPayerData,
    
    this.reconciliationService.addPayment(
      this.sharedService.providerId,
    body,
      this.selctedReconciliationPayerData
      
    ).subscribe(event => {
      if (event instanceof HttpResponse) {
        if (event.status === 200) {
          this.sharedService.loadingChanged.next(false);
          this.dialogService.openMessageDialog(new MessageDialogData('', 'Your payment data has been saved successfully', false));
          this.status = true;
          this.closeDialog();
        }
        else {
          this.status = false;
        }
      }
    }, err => {
      if (err instanceof HttpErrorResponse) {
        this.sharedService.loadingChanged.next(false);
        this.status = false;
        this.dialogService.openMessageDialog(new MessageDialogData('', err.error, true));
        console.log(err);
      }
    });
  }

  selectedAccountPayer(item, event) {
    if (!event._checked)
      this.selctedReconciliationPayerData.push(item.paymentId);
    else
      this.selctedReconciliationPayerData = this.selctedReconciliationPayerData.filter(ele => ele !== item.paymentId);
  }
  get formCn() { return this.addPaymentForm.controls; }

  dateValidation(event: any) {
    if (event !== null) {
      const startDate = moment(event).format('YYYY-MM-DD');
      const endDate = moment(this.addPaymentForm.value.toDate).format('YYYY-MM-DD');
      if (startDate > endDate) {
        this.addPaymentForm.controls['toDate'].patchValue('');
      }
    }
    this.minDate = new Date(event);

  }










}

