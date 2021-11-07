import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-communication-dialog',
  templateUrl: './add-communication-dialog.component.html',
  styles: []
})
export class AddCommunicationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddCommunicationDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
