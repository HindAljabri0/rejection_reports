import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddEditPaymentDialogComponent } from '../add-edit-payment-dialog/add-edit-payment-dialog.component';

@Component({
  selector: 'app-statement-of-accounts-details',
  templateUrl: './statement-of-accounts-details.component.html',
  styles: []
})
export class StatementOfAccountsDetailsComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddEditPaymentDialog() {
    const dialogRef = this.dialog.open(AddEditPaymentDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm']
      });
  }

}
