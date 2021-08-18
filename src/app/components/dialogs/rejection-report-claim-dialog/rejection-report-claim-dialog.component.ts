import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RejectionReportClaimDialogData } from 'src/app/models/dialogData/rejectionReportClaimDialogData';

@Component({
  selector: 'app-rejection-report-claim-dialog',
  templateUrl: './rejection-report-claim-dialog.component.html',
  styles: []
})
export class RejectionReportClaimDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RejectionReportClaimDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public claim: RejectionReportClaimDialogData) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
