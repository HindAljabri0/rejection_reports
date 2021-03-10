import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileUploadDialogComponent } from '../../../components/file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-regular-payment-list',
  templateUrl: './regular-payment-list.component.html',
  styles: []
})
export class RegularPaymentListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  fileUploadChange() {
    const dialogRef = this.dialog.open(FileUploadDialogComponent, { panelClass: ['primary-dialog'], autoFocus: false });
  }

}
