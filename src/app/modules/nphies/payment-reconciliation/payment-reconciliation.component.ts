import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationAlertDialogComponent } from 'src/app/components/confirmation-alert-dialog/confirmation-alert-dialog.component';

@Component({
  selector: 'app-payment-reconciliation',
  templateUrl: './payment-reconciliation.component.html',
  styles: []
})
export class PaymentReconciliationComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openSendPaymentNoticeConfimationDialog() {
    const dialogRef = this.dialog.open(ConfirmationAlertDialogComponent, {
      panelClass: ['primary-dialog'],
      disableClose: true,
      autoFocus: false,
      data: {
        mainMessage: 'Payment Notice',
        subMessage: '<span class="semibold">Amount:</span> 123 SR<br><span class="semibold">Payment Status:</span> Paid/Cleared',
        mode: 'warning',
        yesButtonText: 'Send',
        noButtonText: 'Cancel'
      }
    });
  }

}
