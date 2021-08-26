import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PaymentReconciliationDetailsDialogComponent } from '../payment-reconciliation-details-dialog/payment-reconciliation-details-dialog.component';

@Component({
  selector: 'app-payment-reconciliation',
  templateUrl: './payment-reconciliation.component.html',
  styles: []
})
export class PaymentReconciliationComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  showClaims() {
    const dialogRef = this.dialog.open(PaymentReconciliationDetailsDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-xl']
    });
  }

}
