import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-tawuniya-gss-generate-report-dialog',
  templateUrl: './tawuniya-gss-generate-report-dialog.component.html',
  styles: []
})
export class TawuniyaGssGenerateReportDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<TawuniyaGssGenerateReportDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
