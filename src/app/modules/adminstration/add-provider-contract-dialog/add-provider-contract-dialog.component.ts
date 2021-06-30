import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-provider-contract-dialog',
  templateUrl: './add-provider-contract-dialog.component.html',
  styles: []
})
export class AddProviderContractDialogComponent implements OnInit {
  fileUploadFlag = false;

  constructor(private dialogRef: MatDialogRef<AddProviderContractDialogComponent>) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  fileUploadChange() {
    this.fileUploadFlag = true;
  }

}
