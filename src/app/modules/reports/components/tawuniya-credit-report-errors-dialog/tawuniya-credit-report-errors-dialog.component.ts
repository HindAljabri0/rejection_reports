import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-tawuniya-credit-report-errors-dialog',
  templateUrl: './tawuniya-credit-report-errors-dialog.component.html',
  styles: []
})
export class TawuniyaCreditReportErrorsDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<TawuniyaCreditReportErrorsDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
