import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-account-receivable-add-payment',
  templateUrl: './account-receivable-add-payment.component.html',
  styles: []
})
export class AccountReceivableAddPaymentComponent implements OnInit {

  constructor(private dialog: MatDialogRef<AccountReceivableAddPaymentComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialog.close();
  }

}
