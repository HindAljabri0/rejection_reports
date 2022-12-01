import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, throwMatDuplicatedDrawerError } from '@angular/material';
import { ConfirmAdminDeleteDialogComponent } from '../dialogs/confirm-admin-delete-dialog/confirm-admin-delete-dialog.component';

@Component({
  selector: 'app-confirmation-alert-dialog',
  templateUrl: './confirmation-alert-dialog.component.html',
  styles: []
})
export class ConfirmationAlertDialogComponent implements OnInit {
  data: any;
  constructor(private dialogRef: MatDialogRef<ConfirmAdminDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.data = dialogData;
  }

  ngOnInit() {
  }
  yesClick() {
    this.dialogRef.close(true);
  }

  noClick() {
    this.dialogRef.close(false);
  }

  Convert(){
    this.dialogRef.close("convert");
  }
}
