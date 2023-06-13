import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ChronicPatientDetailsComponent } from '../chronic-patient-details/chronic-patient-details.component';

@Component({
  selector: 'app-chronic-patients',
  templateUrl: './chronic-patients.component.html',
  styles: []
})
export class ChronicPatientsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openChronicPatientDetails() {
    const dialogRef = this.dialog.open(ChronicPatientDetailsComponent, {
      panelClass: ['primary-dialog', 'full-screen-dialog'],
      autoFocus: false
    });
  }

}
