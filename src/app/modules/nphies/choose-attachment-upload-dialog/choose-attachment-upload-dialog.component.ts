import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-choose-attachment-upload-dialog',
  templateUrl: './choose-attachment-upload-dialog.component.html',
  styles: []
})
export class ChooseAttachmentUploadDialogComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ChooseAttachmentUploadDialogComponent>
  ) { }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
