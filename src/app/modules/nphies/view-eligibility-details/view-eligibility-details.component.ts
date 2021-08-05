import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-eligibility-details',
  templateUrl: './view-eligibility-details.component.html',
  styles: []
})
export class ViewEligibilityDetailsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewEligibilityDetailsComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
