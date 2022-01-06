import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-search-billing-patient-dialog',
  templateUrl: './search-billing-patient-dialog.component.html',
  styles: []
})
export class SearchBillingPatientDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<SearchBillingPatientDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
