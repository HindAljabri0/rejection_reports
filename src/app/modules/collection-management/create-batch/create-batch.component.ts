import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddBatchDialogComponent } from '../add-batch-dialog/add-batch-dialog.component';

@Component({
  selector: 'app-create-batch',
  templateUrl: './create-batch.component.html',
  styles: []
})
export class CreateBatchComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddBatchDialog() {
    const dialogRef = this.dialog.open(AddBatchDialogComponent,
      {
        panelClass: ['primary-dialog', 'dialog-sm']
      });
  }

}
