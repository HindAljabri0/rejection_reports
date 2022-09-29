import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-upcoming-feature-dialog',
  templateUrl: './upcoming-feature-dialog.component.html',
  styles: []
})
export class UpcomingFeatureDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<UpcomingFeatureDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
