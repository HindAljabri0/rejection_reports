import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pbm-validation-response-summary-dialog',
  templateUrl: './pbm-validation-response-summary-dialog.component.html',
  styles: []
})
export class PbmValidationResponseSummaryDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PbmValidationResponseSummaryDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
