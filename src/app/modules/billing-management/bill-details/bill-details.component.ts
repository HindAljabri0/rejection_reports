import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddBillServiceDialogComponent } from '../add-bill-service-dialog/add-bill-service-dialog.component';

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styles: []
})
export class BillDetailsComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openAddServiceDialog() {
    const dialogRef = this.dialog.open(AddBillServiceDialogComponent, {
      panelClass: ['primary-dialog']
    })
  }

}
