import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-view-print-preview-dialog',
  templateUrl: './view-print-preview-dialog.component.html',
  styles: []
})
export class ViewPrintPreviewDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ViewPrintPreviewDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  print() {
    document.querySelector('html').classList.add('print-document');
    window.print();
    document.querySelector('html').classList.remove('print-document');
  }

}
