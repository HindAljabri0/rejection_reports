import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-final-rejection-dialog',
  templateUrl: './add-final-rejection-dialog.component.html',
  styles: []
})
export class AddFinalRejectionDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddFinalRejectionDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
