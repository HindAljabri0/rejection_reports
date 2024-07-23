import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-prescription-dispense-dialog',
  templateUrl: './prescription-dispense-dialog.component.html',
  styleUrls: ['./prescription-dispense-dialog.component.css']
})
export class PrescriptionDispenseDialogComponent implements OnInit {
    
    
    currentOpenItem: number = null;


    constructor(
        private dialogRef: MatDialogRef<PrescriptionDispenseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data
        ) { }
    
        DispenseQueryResult:any;  
    
      ngOnInit() {
        this.DispenseQueryResult = this.data.DispenseQueryResult;
        console.log("the data in the dailog"+JSON.stringify(this.DispenseQueryResult));
      }
    
      closeDialog() {
        this.dialogRef.close();
      }
      hasSuggestedDrugs(items: any[]): boolean {
        return items.some(item => item.suggestedDrugs && item.suggestedDrugs.length > 0);
    }

}
