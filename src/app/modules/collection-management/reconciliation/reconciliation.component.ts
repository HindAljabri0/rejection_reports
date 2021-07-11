import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styles: []
})
export class ReconciliationComponent implements OnInit {
  amountAdded = false;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddPaymentDialog() {
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
    dialogRef.afterClosed().subscribe(result => {
      this.amountAdded = true;
    }, error => { });
  }

}
