import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';

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
    const dialogRef = this.dialog.open(FileUploadDialogComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

}
