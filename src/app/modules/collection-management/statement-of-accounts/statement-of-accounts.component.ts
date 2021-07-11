import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddStatementOfAccountsDialogComponent } from '../add-statement-of-accounts-dialog/add-statement-of-accounts-dialog.component';

@Component({
  selector: 'app-statement-of-accounts',
  templateUrl: './statement-of-accounts.component.html',
  styles: []
})
export class StatementOfAccountsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddStatementOfAccountDialog() {
    let dialogRef = this.dialog.open(AddStatementOfAccountsDialogComponent, {
      panelClass: ['primary-dialog']
    })
  }

}
