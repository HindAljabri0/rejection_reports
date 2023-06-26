import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-prescription-details-dialog',
  templateUrl: './view-prescription-details-dialog.component.html',
  styles: []
})
export class ViewPrescriptionDetailsDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ViewPrescriptionDetailsDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
