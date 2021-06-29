import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-json-view-dialog',
  templateUrl: './json-view-dialog.component.html',
  styles: ['']
})
export class JsonViewDialogComponent implements OnInit {
  copyText = 'Copy JSON';
  json: any;

  constructor(
    private dialogRef: MatDialogRef<JsonViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, json: string },
  ) { }

  ngOnInit() {
    this.json = this.getAsObject();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAsObject() {
    return JSON.parse(this.data.json);
  }

  clickCopy() {
    this.copyText = 'Copied';
    setTimeout(() => {
      this.copyText = 'Copy JSON';
    }, 2000);
  }

}
