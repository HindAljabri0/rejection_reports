import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-view-class',
  templateUrl: './add-edit-view-class.component.html',
  styles: []
})
export class AddEditViewClassComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddEditViewClassComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
