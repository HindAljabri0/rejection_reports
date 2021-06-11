import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-account-receivable-add-batch',
  templateUrl: './account-receivable-add-batch.component.html',
  styles: []
})
export class AccountReceivableAddBatchComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AccountReceivableAddBatchComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
