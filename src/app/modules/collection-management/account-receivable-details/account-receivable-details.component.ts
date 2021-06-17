import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';
import { AccountReceivableAddBatchComponent } from '../account-receivable-add-batch/account-receivable-add-batch.component';
import { AccountReceivableAddPaymentComponent } from '../account-receivable-add-payment/account-receivable-add-payment.component';

@Component({
  selector: 'app-account-receivable-details',
  templateUrl: './account-receivable-details.component.html',
  styles: []
})
export class AccountReceivableDetailsComponent implements OnInit {
  recordOneOpen = false;
  recordTwoOpen = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddBatchDialog() {
    let dialogRef = this.dialog.open(AccountReceivableAddBatchComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

  openAddPaymentDialog(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(AccountReceivableAddPaymentComponent,
      {
        panelClass: ['primary-dialog']
      });
  }

}
