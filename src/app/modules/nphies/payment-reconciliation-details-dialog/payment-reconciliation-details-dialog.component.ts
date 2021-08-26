import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-payment-reconciliation-details-dialog',
  templateUrl: './payment-reconciliation-details-dialog.component.html',
  styles: []
})
export class PaymentReconciliationDetailsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PaymentReconciliationDetailsDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
