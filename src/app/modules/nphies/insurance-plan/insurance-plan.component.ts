import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddInsurancePlanDialogComponent } from '../add-insurance-plan-dialog/add-insurance-plan-dialog.component';

@Component({
  selector: 'app-insurance-plan',
  templateUrl: './insurance-plan.component.html',
  styles: []
})
export class InsurancePlanComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddInsuranceDialog() {
    const dialogRef = this.dialog.open(AddInsurancePlanDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-xl']
      })
  }

}
