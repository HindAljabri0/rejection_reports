import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-statement-of-accounts-dialog',
  templateUrl: './add-statement-of-accounts-dialog.component.html',
  styles: []
})
export class AddStatementOfAccountsDialogComponent implements OnInit {
  fileUploadFlag = false;

  constructor(private dialogRef: MatDialogRef<AddStatementOfAccountsDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fileUploadChange() {
    this.fileUploadFlag = true;
  }

}
