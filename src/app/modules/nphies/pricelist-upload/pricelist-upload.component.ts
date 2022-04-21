import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pricelist-upload',
  templateUrl: './pricelist-upload.component.html',
  styles: []
})
export class PricelistUploadComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PricelistUploadComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
