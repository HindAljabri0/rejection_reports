import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-json-view-dialog',
  templateUrl: './json-view-dialog.component.html',
  styles: ['']
})
export class JsonViewDialogComponent implements OnInit {
  copyText = 'Copy JSON';

  constructor(
    private dialogRef: MatDialogRef<JsonViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, tabs: { title: string, json: string }[] },
  ) { }

  ngOnInit() {
    this.data.tabs = this.data.tabs.filter(tabData => tabData.json != null && tabData.json.trim().length > 0).map(tabData => {
      tabData.json = this.getAsObject(tabData.json);
      return tabData;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAsObject(json: string) {
    return JSON.parse(json);
  }

  clickCopy() {
    this.copyText = 'Copied';
    setTimeout(() => {
      this.copyText = 'Copy JSON';
    }, 2000);
  }

}
