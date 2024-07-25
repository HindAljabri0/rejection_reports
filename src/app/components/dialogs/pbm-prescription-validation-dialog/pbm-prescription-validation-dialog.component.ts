import { Component, OnInit , Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pbm-prescription-validation-dialog',
  templateUrl: './pbm-prescription-validation-dialog.component.html',
  styleUrls: ['../prescription-dispense-dialog/prescription-dispense-dialog.component.css'],
  
})
export class PbmPrescriptionValidationDialogComponent implements OnInit {

    currentOpenItem: number = null;

    constructor(
        private dialogRef: MatDialogRef<PbmPrescriptionValidationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data
        ) { }
    
        PbmPrescriptionResult:any;  
    
      ngOnInit() {
        this.PbmPrescriptionResult = this.data.PbmPrescriptionResult;
        console.log("the data in the dailog"+JSON.stringify(this.PbmPrescriptionResult));
      }
    
      closeDialog() {
        this.dialogRef.close();
      }
}
