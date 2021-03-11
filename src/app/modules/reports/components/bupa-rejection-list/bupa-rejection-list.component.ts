import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BupaRejectionUploadModalComponent } from '../bupa-rejection-upload-modal/bupa-rejection-upload-modal.component';

@Component({
  selector: 'app-bupa-rejection-list',
  templateUrl: './bupa-rejection-list.component.html',
  styleUrls: ['./bupa-rejection-list.component.css']
})
export class BupaRejectionListComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openPdf() {
    const dialogRef = this.dialog.open(BupaRejectionUploadModalComponent, { panelClass: ['primary-dialog'], autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    }, error => {

    });
  }

}
