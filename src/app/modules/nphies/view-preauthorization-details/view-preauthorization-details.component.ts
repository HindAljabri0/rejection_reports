import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-preauthorization-details',
  templateUrl: './view-preauthorization-details.component.html',
  styles: []
})
export class ViewPreauthorizationDetailsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewPreauthorizationDetailsComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
