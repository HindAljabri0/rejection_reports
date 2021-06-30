import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-statement-of-accounts-upload',
  templateUrl: './statement-of-accounts-upload.component.html',
  styles: []
})
export class StatementOfAccountsUploadComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<StatementOfAccountsUploadComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
