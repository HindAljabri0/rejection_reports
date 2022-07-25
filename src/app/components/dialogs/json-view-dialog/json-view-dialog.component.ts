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
          IsDownload: boolean,
          title: string,
          fileName: string,
          json: string
        }[]
      },
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

  clickCopy(title) {
    this.copyText = 'Copied';
    let tabs;
    this.data.tabs.filter(tabData => tabData.title == title).forEach(tabData => { tabs = tabData.json; });
    this.clipboardService.copy(JSON.stringify(tabs));
    setTimeout(() => {
      this.copyText = 'Copy JSON';
    }, 2000);
  }

  download(fileName, json){
    const sJson = JSON.stringify(json);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=UTF-8,' + encodeURIComponent(sJson));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click(); // simulate click
    document.body.removeChild(element);
  }

}
