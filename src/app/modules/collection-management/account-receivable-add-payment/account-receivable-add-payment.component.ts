import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-account-receivable-add-payment',
  templateUrl: './account-receivable-add-payment.component.html',
  styles: []
})
export class AccountReceivableAddPaymentComponent implements OnInit {
  status: boolean = false;
  payementData: any[] = [];
  selctedAccountPayerData: any = [];
  datePickerConfig: Partial<BsDatepickerConfig> = { showWeekNumbers: false, dateInputFormat: 'DD/MM/YYYY' };
  addPaymentForm: FormGroup;
  minDate: any;
  submitted: any;
  constructor(private dialog: MatDialogRef<AccountReceivableAddPaymentComponent>, private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private dialogService: DialogService, @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.status = false;
    this.formLoad();
    this.getReceivableData();
  }
  formLoad() {
    const threeMonthPreviousDate = new Date().setMonth(new Date().getMonth() - 3);
    this.addPaymentForm = this.formBuilder.group({
      fromDate: [new Date(threeMonthPreviousDate), Validators.required],
      toDate: [new Date(), Validators.required],
    });
  }
  getReceivableData() {
    if (this.addPaymentForm.invalid)
      return
    const fromDate = moment(this.addPaymentForm.value.fromDate).format('YYYY-MM-DD');
    const toDate = moment(this.addPaymentForm.value.toDate).format('YYYY-MM-DD');
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.getAccountReceivalble(
      this.sharedService.providerId,
      this.data.payerId,
      fromDate, toDate
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
      paymentIds: this.selctedAccountPayerData,
      receivableDate: moment(this.data.
        rejectionDate).format('YYYY-MM-DD')
    }
    this.collectionManagementService.addAccountReceivable(
      this.sharedService.providerId,
      body
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

  closeDialog() {
    this.dialog.close();
  }
  selectedAccountPayer(item, event) {
    if (!event._checked)
      this.selctedAccountPayerData.push(item.paymentId);
    else
      this.selctedAccountPayerData = this.selctedAccountPayerData.filter(ele => ele !== item.paymentId);
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
