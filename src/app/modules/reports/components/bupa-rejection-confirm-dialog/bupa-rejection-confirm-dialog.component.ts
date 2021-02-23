import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BupaRejectionReportModel } from 'src/app/models/bupaRejectionReport';

@Component({
  selector: 'app-bupa-rejection-confirm-dialog',
  templateUrl: './bupa-rejection-confirm-dialog.component.html',
  styles: []
})
export class BupaRejectionConfirmDialogComponent implements OnInit {

  dialogData: BupaRejectionReportModel;
  constructor(private dialogRef: MatDialogRef<BupaRejectionConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: BupaRejectionReportModel) {
    this.dialogData = this.data;
   }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
