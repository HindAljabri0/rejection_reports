import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-edit-payment-dialog',
  templateUrl: './add-edit-payment-dialog.component.html',
  styles: []
})
export class AddEditPaymentDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddEditPaymentDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}

