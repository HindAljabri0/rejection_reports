import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material';
import { AddCommunicationDialogComponent } from '../add-communication-dialog/add-communication-dialog.component';

@Component({
  selector: 'app-view-preauthorization-details',
  templateUrl: './view-preauthorization-details.component.html',
  styles: []
})
export class ViewPreauthorizationDetailsComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ViewPreauthorizationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  openAddCommunicationDialog() {
    this.dialog.open(AddCommunicationDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });
  }

}
