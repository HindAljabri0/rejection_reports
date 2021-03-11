import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadDialogComponent } from 'src/app/components/file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-vat-payment-report-list',
  templateUrl: './vat-payment-report-list.component.html',
  styles: []
})
export class VatPaymentReportListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  fileUploadChange() {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

}
