import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StatementOfAccountsUploadComponent } from '../statement-of-accounts-upload/statement-of-accounts-upload.component';

@Component({
  selector: 'app-statement-of-accounts',
  templateUrl: './statement-of-accounts.component.html',
  styles: []
})
export class StatementOfAccountsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  fileUploadChange() {
    const dialogRef = this.dialog.open(StatementOfAccountsUploadComponent, { panelClass: ['primary-dialog', 'dialog-lg'], autoFocus: false });
  }

}
