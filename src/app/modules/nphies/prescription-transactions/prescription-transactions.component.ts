import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ViewPrescriptionDetailsDialogComponent } from '../view-prescription-details-dialog/view-prescription-details-dialog.component';

@Component({
  selector: 'app-prescription-transactions',
  templateUrl: './prescription-transactions.component.html',
  styles: []
})
export class PrescriptionTransactionsComponent implements OnInit {

  paginatorPageSizeOptions = [10, 20, 50, 100];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openDetailsDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog', 'full-screen-dialog', 'view-preauth-details'];
    const dialogRef = this.dialog.open(ViewPrescriptionDetailsDialogComponent, dialogConfig);
  }

}
