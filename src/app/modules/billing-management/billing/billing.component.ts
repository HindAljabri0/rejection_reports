import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SearchBillingPatientDialogComponent } from '../search-billing-patient-dialog/search-billing-patient-dialog.component';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styles: []
})
export class BillingComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openSearchPatientDialog() {
    const dialogRef = this.dialog.open(SearchBillingPatientDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    })
  }

}
