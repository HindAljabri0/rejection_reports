import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-insurance-plan-dialog',
  templateUrl: './add-insurance-plan-dialog.component.html',
  styles: []
})
export class AddInsurancePlanDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddInsurancePlanDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
