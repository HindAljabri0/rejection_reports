import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-change-log-dialog',
  templateUrl: './change-log-dialog.component.html',
  styles: []
})
export class ChangeLogDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ChangeLogDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
