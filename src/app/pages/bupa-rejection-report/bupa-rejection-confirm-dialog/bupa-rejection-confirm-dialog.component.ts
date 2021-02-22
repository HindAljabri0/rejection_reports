import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-bupa-rejection-confirm-dialog',
  templateUrl: './bupa-rejection-confirm-dialog.component.html',
  styles: []
})
export class BupaRejectionConfirmDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<BupaRejectionConfirmDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
