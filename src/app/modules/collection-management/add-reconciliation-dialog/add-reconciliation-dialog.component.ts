import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-reconciliation',
  templateUrl: './add-reconciliation-dialog.component.html',
  styles: []
})
export class AddReconciliationDialogComponent implements OnInit {

  searchComplete = false;
  constructor(private dialogRef: MatDialogRef<AddReconciliationDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
