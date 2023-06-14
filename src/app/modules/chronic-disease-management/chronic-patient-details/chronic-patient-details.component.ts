import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-chronic-patient-details',
  templateUrl: './chronic-patient-details.component.html',
  styles: []
})
export class ChronicPatientDetailsComponent implements OnInit {

  currentDetailsOpen = -1;

  constructor(
    private dialogRef: MatDialogRef<ChronicPatientDetailsComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  toggleRow(index) {
    this.currentDetailsOpen = (this.currentDetailsOpen == index) ? -1 : index;
  }

}
