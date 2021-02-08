import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upload-summary-dialog',
  templateUrl: './upload-summary-dialog.component.html',
  styles: []
})
export class UploadSummaryDialogComponent implements OnInit {
  dialogData: any;
  constructor(
    private dialogRef: MatDialogRef<UploadSummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any) {
    this.dialogData = data;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
