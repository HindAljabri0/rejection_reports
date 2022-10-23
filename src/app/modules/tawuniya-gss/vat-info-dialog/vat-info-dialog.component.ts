import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-vat-info-dialog',
  templateUrl: './vat-info-dialog.component.html',
  styles: []
})
export class VatInfoDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<VatInfoDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
