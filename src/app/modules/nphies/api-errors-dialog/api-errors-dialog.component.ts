import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiError } from 'src/app/models/nphies/apiError';

@Component({
  selector: 'app-api-errors-dialog',
  templateUrl: './api-errors-dialog.component.html',
  styles: []
})
export class ApiErrorsDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ApiErrorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ApiError
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
