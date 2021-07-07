import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

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

  openAddPaymentDialog(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
  }

  toggleRow(index) {
    this.currentOpenRecord = (index == this.currentOpenRecord) ? -1 : index;
  }

}
