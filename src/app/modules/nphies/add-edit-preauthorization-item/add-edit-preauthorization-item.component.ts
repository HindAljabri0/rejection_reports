import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-preauthorization-item',
  templateUrl: './add-edit-preauthorization-item.component.html',
  styles: []
})
export class AddEditPreauthorizationItemComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddEditPreauthorizationItemComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
