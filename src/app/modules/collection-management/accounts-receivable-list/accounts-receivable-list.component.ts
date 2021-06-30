import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
    selector: 'app-accounts-receivable-list',
    templateUrl: './accounts-receivable-list.component.html',
    styles: []
})
export class AccountsReceivableListComponent implements OnInit {
    constructor(private dialog: MatDialog) { }

    ngOnInit() {
    }

}
