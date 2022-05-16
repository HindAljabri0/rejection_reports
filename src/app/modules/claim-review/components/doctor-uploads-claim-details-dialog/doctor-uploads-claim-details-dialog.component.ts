import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-doctor-uploads-claim-details-dialog',
  templateUrl: './doctor-uploads-claim-details-dialog.component.html',
  styles: []
})
export class DoctorUploadsClaimDetailsDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DoctorUploadsClaimDetailsDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
