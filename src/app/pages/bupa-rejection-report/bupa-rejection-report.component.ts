import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BupaRejectionConfirmDialogComponent } from './bupa-rejection-confirm-dialog/bupa-rejection-confirm-dialog.component';

@Component({
  selector: 'app-bupa-rejection-report',
  templateUrl: './bupa-rejection-report.component.html',
  styles: []
})
export class BupaRejectionReportComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  controlClick(e) {
    e.currentTarget.querySelector('.form-control').focus();
  }

  saveClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = ['primary-dialog'];
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(BupaRejectionConfirmDialogComponent, dialogConfig);
  }

}
