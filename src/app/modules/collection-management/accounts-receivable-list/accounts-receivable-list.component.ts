import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddReconciliationPaymentDialogComponent } from '../add-reconciliation-payment-dialog/add-reconciliation-payment-dialog.component';

@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    constructor(private dialog: MatDialog) { }

    ngOnInit() {
    }

    openAddReconciliationPaymentDialog() {
        let dialogRef = this.dialog.open(AddReconciliationPaymentDialogComponent,
            {
                panelClass: ['primary-dialog']
            });
    }

}
