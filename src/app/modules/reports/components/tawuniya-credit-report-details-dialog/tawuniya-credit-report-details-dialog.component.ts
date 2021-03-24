import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-tawuniya-credit-report-details-dialog',
  templateUrl: './tawuniya-credit-report-details-dialog.component.html',
  styles: []
})
export class TawuniyaCreditReportDetailsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TawuniyaCreditReportDetailsDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
