import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadDialogComponent } from '../../../components/file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-final-settlement-report-list',
  templateUrl: './final-settlement-report-list.component.html',
  styles: []
})
export class FinalSettlementReportListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  fileUploadChange() {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

}
