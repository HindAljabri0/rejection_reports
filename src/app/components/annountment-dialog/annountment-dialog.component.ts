import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-annountment-dialog',
  templateUrl: './annountment-dialog.component.html',
  styles: []
})
export class AnnountmentDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<AnnountmentDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
