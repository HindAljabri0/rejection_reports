import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-physician-dialog',
  templateUrl: './add-physician-dialog.component.html',
  styles: []
})
export class AddPhysicianDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddPhysicianDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
