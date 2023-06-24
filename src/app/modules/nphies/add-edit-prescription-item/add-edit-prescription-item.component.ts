import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-prescription-item',
  templateUrl: './add-edit-prescription-item.component.html',
  styles: []
})
export class AddEditPrescriptionItemComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddEditPrescriptionItemComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
