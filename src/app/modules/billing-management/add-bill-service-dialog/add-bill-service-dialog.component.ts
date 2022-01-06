import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-bill-service-dialog',
  templateUrl: './add-bill-service-dialog.component.html',
  styles: []
})
export class AddBillServiceDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AddBillServiceDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
