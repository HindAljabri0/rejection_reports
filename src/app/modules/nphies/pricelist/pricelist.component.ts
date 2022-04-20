import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PricelistUploadComponent } from '../pricelist-upload/pricelist-upload.component';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styles: []
})
export class PricelistComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openUploadPricelistDialog() {
    const dialogRef = this.dialog.open(PricelistUploadComponent, {
      panelClass: ['primary-dialog', 'dialog-lg']
    });
  }

}
