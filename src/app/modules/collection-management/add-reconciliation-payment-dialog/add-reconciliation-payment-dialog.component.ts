import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-add-reconciliation-payment-dialog',
  templateUrl: './add-reconciliation-payment-dialog.component.html',
  styles: []
})
export class AddReconciliationPaymentDialogComponent implements OnInit {
  amountSelected = false;

  constructor(private dialogRef: MatDialogRef<AddReconciliationPaymentDialogComponent>, private dialog: MatDialog) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openSelectPaymentDialog() {
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
    dialogRef.afterClosed().subscribe(result => {
      this.amountSelected = true;
    }, error => {

    });
  }

}
