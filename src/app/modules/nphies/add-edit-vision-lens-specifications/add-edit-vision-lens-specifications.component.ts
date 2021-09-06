import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-vision-lens-specifications',
  templateUrl: './add-edit-vision-lens-specifications.component.html',
  styles: []
})
export class AddEditVisionLensSpecificationsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddEditVisionLensSpecificationsComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
