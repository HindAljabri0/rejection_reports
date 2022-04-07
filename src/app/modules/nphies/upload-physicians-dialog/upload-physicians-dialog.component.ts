import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-upload-physicians-dialog',
  templateUrl: './upload-physicians-dialog.component.html',
  styles: []
})
export class UploadPhysiciansDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<UploadPhysiciansDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
