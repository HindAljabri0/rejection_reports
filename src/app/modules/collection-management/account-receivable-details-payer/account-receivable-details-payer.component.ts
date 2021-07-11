import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';
import { AddIntialRejectionDialogComponent } from '../add-intial-rejection-dialog/add-intial-rejection-dialog.component';

@Component({
  selector: 'app-account-receivable-details-payer',
  templateUrl: './account-receivable-details-payer.component.html',
  styles: []
})
export class AccountReceivableDetailsPayerComponent implements OnInit {

  currentOpenRecord = -1;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openAddPaymentDialog() {
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
  }

  toggleRow(index) {
    this.currentOpenRecord = (index == this.currentOpenRecord) ? -1 : index;
  }

  openAddInitialRejectionDialog() {
    const dialogRef = this.dialog.open(AddIntialRejectionDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm']
      });
  }

}
