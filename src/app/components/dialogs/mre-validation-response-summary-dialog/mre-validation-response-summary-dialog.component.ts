import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mre-validation-response-summary-dialog',
  templateUrl: './mre-validation-response-summary-dialog.component.html',
  styleUrls: []
})
export class MreValidationResponseSummaryDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MreValidationResponseSummaryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data
    ) { }

  mreResult:any;  

  ngOnInit() {
    this.mreResult = this.data.MRE_result;
    console.log("the data in the dailog"+JSON.stringify(this.mreResult));
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
