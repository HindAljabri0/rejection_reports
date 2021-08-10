import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as moment from 'moment';
import { CollectionManagementService } from 'src/app/services/collection-management/collection-management.service';
import { DialogService } from 'src/app/services/dialogsService/dialog.service';
import { SharedServices } from 'src/app/services/shared.services';
import { MessageDialogData } from 'src/app/models/dialogData/messageDialogData';
@Component({
  selector: 'app-account-receivable-add-payment',
  templateUrl: './account-receivable-add-payment.component.html',
  styles: []
})
export class AccountReceivableAddPaymentComponent implements OnInit {
  status: boolean = false;
  payementData: any[] = [];
  selctedAccountPayerData: any = [];

  constructor(private dialog: MatDialogRef<AccountReceivableAddPaymentComponent>, private collectionManagementService: CollectionManagementService, private sharedService: SharedServices, private dialogService: DialogService, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.status = false;
    this.getReceivableData();
  }
  getReceivableData() {
    this.sharedService.loadingChanged.next(true);
    this.collectionManagementService.getAccountReceivalble(
      this.sharedService.providerId,
      this.data.payerId
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
    this.collectionManagementService.addAccountReceivalble(
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

}
