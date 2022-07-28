import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ClipboardService } from 'ngx-clipboard';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-json-view-dialog',
  templateUrl: './json-view-dialog.component.html',
  styles: ['']
})
export class JsonViewDialogComponent implements OnInit {
  copyText = 'Copy JSON';

  constructor(
    private clipboardService: ClipboardService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<JsonViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:
      {
        title: string,
        tabs: {
          title: string,
          json: string
        }[]
      },
  ) { }

  ngOnInit() {
    this.data.tabs = this.data.tabs.filter(tabData => {
      if (typeof (tabData.json) === 'object') {
        if (tabData.json != null && JSON.stringify(tabData.json).trim().length > 0) {
          return true;
        } else {
          return false;
        }
      } else if (typeof (tabData.json) === 'string') {
        if (tabData.json != null && tabData.json.trim().length > 0) {
          return true;
        } else {
          return false;
        }
      }
    }).map(tabData => {
      if (typeof (tabData.json) === 'string') {
        tabData.json = this.getAsObject(tabData.json);
      }
      return tabData;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getAsObject(json: string) {
    return JSON.parse(json);
  }

  clickCopy(title) {
    this.copyText = 'Copied';
    let tabs;
    this.data.tabs.filter(tabData => tabData.title == title).forEach(tabData => { tabs = tabData.json; });
    this.clipboardService.copy(JSON.stringify(tabs));
    setTimeout(() => {
      this.copyText = 'Copy JSON';
    }, 2000);
  }

}
