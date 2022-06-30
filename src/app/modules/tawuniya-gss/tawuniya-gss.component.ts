import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TawuniyaGssGenerateReportDialogComponent } from './tawuniya-gss-generate-report-dialog/tawuniya-gss-generate-report-dialog.component';

@Component({
  selector: 'app-tawuniya-gss',
  templateUrl: './tawuniya-gss.component.html',
  styles: []
})
export class TawuniyaGssComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openGenerateReportDialog() {
    const dialogRef = this.dialog.open(TawuniyaGssGenerateReportDialogComponent, {
      panelClass: ['primary-dialog', 'dialog-sm']
    })
  }

}
