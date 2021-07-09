import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-intial-rejection-dialog',
  templateUrl: './add-intial-rejection-dialog.component.html',
  styles: []
})
export class AddIntialRejectionDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddIntialRejectionDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
