import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { AccountReceivableAddMonthComponent } from '../account-receivable-add-month/account-receivable-add-month.component';

@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    constructor(private dialog: MatDialog) { }

    ngOnInit() {
    }

    openAddMonthDialog() {
        const dialogRef = this.dialog.open(AccountReceivableAddMonthComponent, { panelClass: ['primary-dialog', 'dialog-sm'], autoFocus: false });
    }

}
