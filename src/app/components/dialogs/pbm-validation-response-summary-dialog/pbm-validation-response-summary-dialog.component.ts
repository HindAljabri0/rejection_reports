
import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pbm-validation-response-summary-dialog',
  templateUrl: './pbm-validation-response-summary-dialog.component.html',
  styles: []
})
export class PbmValidationResponseSummaryDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PbmValidationResponseSummaryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data
  ) { }
  pbmResult:any;  
  ngOnInit() {
    this.pbmResult = this.data.PBM_result;
    console.log("the data in the dailog"+JSON.stringify(this.pbmResult));
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
