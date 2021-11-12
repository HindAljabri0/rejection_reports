import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddFinalRejectionDialogComponent } from '../add-final-rejection-dialog/add-final-rejection-dialog.component';
import { AddReconciliationDialogComponent } from '../add-reconciliation-dialog/add-reconciliation-dialog.component';

@Component({
  selector: 'app-reconciliation-report',
  templateUrl: './reconciliation-report.component.html',
  styles: []
})
export class ReconciliationReportComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddReconciliationDialog() {
    const dialogRef = this.dialog.open(AddReconciliationDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-lg'],
      autoFocus: false
    })
  }

  openFinalRejectionDialog() {
    const dialogRef = this.dialog.open(AddFinalRejectionDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm'],
      autoFocus: false
    })
  }

}
