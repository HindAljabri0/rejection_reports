import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-account-receivable-details',
  templateUrl: './account-receivable-details.component.html',
  styles: []
})
export class AccountReceivableDetailsComponent implements OnInit {
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
    this.currentOpenRecord = (index != -1) ? -1 : index;
  }

}
